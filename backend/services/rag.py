import urllib.request
import urllib.parse
import json
import re
import requests
import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

def fetch_news_smart(text: str) -> list[str]:
    queries = []

    # 1️⃣ Full sentence (best case)
    queries.append(text)

    # 2️⃣ Cleaned (remove noise)
    cleaned = " ".join([w for w in text.split() if len(w) > 3])
    queries.append(cleaned)

    # 3️⃣ First few words
    queries.append(" ".join(text.split()[:5]))

    # 4️⃣ Keywords only (strongest fallback)
    keywords = [w for w in text.split() if w.lower() not in ["the", "is", "and", "of", "a"]]
    queries.append(" ".join(keywords[:4]))

    for q in queries:
        result = fetch_news(q)
        if result:
            return result   # stop as soon as something works

    return []

def fetch_news(query: str) -> list[str]:
    url = "https://newsapi.org/v2/everything"
    
    params = {
        "q": query,
        "language": "en",
        "sortBy": "relevancy",
        "pageSize": 2,
        "apiKey": NEWS_API_KEY
    }

    try:
        res = requests.get(url, params=params)
        data = res.json()

        articles = data.get("articles", [])
        if not articles:
            return []

        summaries = []
        for article in articles:
            title = article.get("title", "")
            source = article.get("source", {}).get("name", "")
            desc = article.get("description", "")
            summaries.append(f"Source: {source}\nTitle: {title}\nDescription: {desc}")

        return summaries

    except:
        return []

def fetch_wikipedia_summary(query: str) -> str:
    """
    Fetches a short summary from Wikipedia using the search API.
    Return clean text summary.
    """
    # 1. Prioritize 'United States' if 'America' is mentioned
    query_lower = query.lower()
    if "america" in query_lower and "united states" not in query_lower:
        query += " United States"

    encoded_query = urllib.parse.quote(query)
    # Get up to 5 results to allow for filtering
    url = f"https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&explaintext=true&exsentences=2&generator=search&gsrsearch={encoded_query}&gsrlimit=5&format=json"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'FakeNewsDetectorApp/1.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            pages = data.get("query", {}).get("pages", {})
            
            if not pages:
                return ""
                
            # Filter out songs/media and collect valid pages
            valid_pages = []
            excluded_terms = ["(song)", "(album)", "(film)", "(band)", "(franchise)", "(soundtrack)"]
            
            for page in pages.values():
                title = page.get("title", "")
                extract = page.get("extract", "")
                
                is_media = any(term in title.lower() for term in excluded_terms)
                
                if extract and not is_media:
                    valid_pages.append(page)
            
            if not valid_pages:
                # Fallback if everything was excluded
                valid_pages = list(pages.values())
                
            # Sort by search rank index (1 is best match)
            valid_pages.sort(key=lambda p: p.get("index", 999))
            
            # Prefer exact title match over search rank
            best_page = valid_pages[0]
            original_query_clean = query.lower().replace(" united states", "").strip()
            
            for page in valid_pages:
                if page.get("title", "").lower() == original_query_clean:
                    best_page = page
                    break
                    
            title = best_page.get("title", "")
            extract = best_page.get("extract", "")
            
            if extract:
                clean_extract = re.sub(r'\s+', ' ', extract).strip()
                return f"Wikipedia ({title}): {clean_extract}"
                
    except Exception:
        pass
        
    return ""

def retrieve_facts(text: str) -> list[str]:
    wiki = fetch_wikipedia_summary(text)
    query = " ".join(text.split()[:5])   
    news = fetch_news_smart(query)
   
    facts = []

    if news:
        facts.extend(news)

    if wiki:
        facts.append(wiki)

    if not facts:
        facts.append("⚠️ No verified sources found for this claim")

    return facts
