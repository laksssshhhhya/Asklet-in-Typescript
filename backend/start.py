import uvicorn
import os

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    
    port = int(os.environ.get("PORT", 8000))  
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False, 
        log_level="info"
    )
