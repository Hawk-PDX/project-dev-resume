import requests
import json
import re
import base64
from urllib.parse import urlparse
from typing import Dict, Optional, List

class GitHubService:
    """Service for fetching GitHub repository data and extracting project information."""
    
    BASE_API_URL = "https://api.github.com"
    
    def __init__(self, github_token: Optional[str] = None):
        """
        Initialize GitHub service.
        
        Args:
            github_token: Optional GitHub personal access token for higher rate limits
        """
        self.headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Portfolio-App/1.0'
        }
        # Only add authorization if token is provided and not a placeholder
        if github_token and github_token.strip() and 'your_github_token_here' not in github_token.lower():
            self.headers['Authorization'] = f'token {github_token}'
            self.authenticated = True
        else:
            self.authenticated = False
    
    def parse_github_url(self, github_url: str) -> Optional[tuple]:
        """
        Parse GitHub URL to extract owner and repo name.
        
        Args:
            github_url: GitHub repository URL
            
        Returns:
            Tuple of (owner, repo) or None if invalid URL
        """
        try:
            parsed = urlparse(github_url)
            if parsed.hostname != 'github.com':
                return None
            
            # Handle URLs like: https://github.com/owner/repo or https://github.com/owner/repo/
            path_parts = [part for part in parsed.path.split('/') if part]
            if len(path_parts) >= 2:
                return path_parts[0], path_parts[1]
            return None
        except Exception:
            return None
    
    def fetch_repository_info(self, github_url: str) -> Dict:
        """
        Fetch comprehensive repository information from GitHub.
        
        Args:
            github_url: GitHub repository URL
            
        Returns:
            Dictionary containing project information
        """
        parsed_url = self.parse_github_url(github_url)
        if not parsed_url:
            raise ValueError("Invalid GitHub URL")
        
        owner, repo = parsed_url
        repo_data = self._get_repo_data(owner, repo)
        readme_data = self._get_readme_data(owner, repo)
        package_data = self._get_package_json_data(owner, repo)
        manifest_data = self._get_manifest_json_data(owner, repo)
        languages = self._get_languages(owner, repo)
        
        # Extract project information
        project_info = {
            'title': repo_data.get('name', '').replace('-', ' ').replace('_', ' ').title(),
            'description': repo_data.get('description', '') or self._extract_description_from_readme(readme_data),
            'technologies': self._extract_technologies(package_data, languages, readme_data, manifest_data),
            'github_url': github_url,
            'github_account': owner,  # Extract the account name from the URL
            'live_url': self._extract_live_url(repo_data, readme_data),
            'image_url': self._extract_cover_image(readme_data, owner, repo),
            'featured': False,  # Let user decide
            'order': 0  # Let user decide
        }
        
        return project_info
    
    def _get_repo_data(self, owner: str, repo: str) -> Dict:
        """Fetch basic repository data from GitHub API."""
        url = f"{self.BASE_API_URL}/repos/{owner}/{repo}"
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            return response.json() if response.status_code == 200 else {}
        except requests.RequestException:
            return {}
    
    def _get_readme_data(self, owner: str, repo: str) -> str:
        """Fetch README content from repository."""
        url = f"{self.BASE_API_URL}/repos/{owner}/{repo}/readme"
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            if response.status_code == 200:
                content = response.json().get('content', '')
                # Decode base64 content
                return base64.b64decode(content).decode('utf-8')
            return ""
        except Exception:
            return ""
    
    def _get_package_json_data(self, owner: str, repo: str) -> Dict:
        """Fetch package.json content if it exists."""
        url = f"{self.BASE_API_URL}/repos/{owner}/{repo}/contents/package.json"
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            if response.status_code == 200:
                content = response.json().get('content', '')
                decoded_content = base64.b64decode(content).decode('utf-8')
                return json.loads(decoded_content)
            return {}
        except Exception:
            return {}
    
    def _get_manifest_json_data(self, owner: str, repo: str) -> Dict:
        """Fetch manifest.json content if it exists (for Chrome extensions)."""
        url = f"{self.BASE_API_URL}/repos/{owner}/{repo}/contents/manifest.json"
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            if response.status_code == 200:
                content = response.json().get('content', '')
                decoded_content = base64.b64decode(content).decode('utf-8')
                return json.loads(decoded_content)
            return {}
        except Exception:
            return {}
    
    def _get_languages(self, owner: str, repo: str) -> Dict:
        """Fetch repository languages from GitHub API."""
        url = f"{self.BASE_API_URL}/repos/{owner}/{repo}/languages"
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            return response.json() if response.status_code == 200 else {}
        except requests.RequestException:
            return {}
    
    def _extract_description_from_readme(self, readme_content: str) -> str:
        """Extract description from README content."""
        if not readme_content:
            return ""
        
        lines = readme_content.split('\n')
        for line in lines:
            line = line.strip()
            # Skip title lines and empty lines
            if line and not line.startswith('#') and not line.startswith('!['):
                # Return first substantial paragraph
                if len(line) > 20:
                    return line[:200] + "..." if len(line) > 200 else line
        return ""
    
    def _extract_technologies(self, package_data: Dict, languages: Dict, readme_content: str, manifest_data: Dict = None) -> str:
        """Extract technologies from various sources."""
        technologies = set()
        
        # From manifest.json (Chrome extensions)
        if manifest_data:
            technologies.add('Chrome Extension')
            # Check manifest version to determine Chrome extension technology level
            manifest_version = manifest_data.get('manifest_version', 2)
            if manifest_version == 3:
                technologies.add('Manifest V3')
            elif manifest_version == 2:
                technologies.add('Manifest V2')
        
        # From package.json dependencies
        if package_data:
            deps = package_data.get('dependencies', {})
            dev_deps = package_data.get('devDependencies', {})
            all_deps = {**deps, **dev_deps}
            
            # Map common dependencies to display names
            tech_mapping = {
                'react': 'React',
                'vue': 'Vue.js',
                'angular': 'Angular',
                'express': 'Express.js',
                'flask': 'Flask',
                'django': 'Django',
                'fastapi': 'FastAPI',
                'next': 'Next.js',
                'nuxt': 'Nuxt.js',
                'typescript': 'TypeScript',
                'tailwindcss': 'Tailwind CSS',
                'bootstrap': 'Bootstrap',
                'sass': 'Sass',
                'webpack': 'Webpack',
                'vite': 'Vite',
                'eslint': 'ESLint',
                'jest': 'Jest',
                'cypress': 'Cypress'
            }
            
            for dep in all_deps.keys():
                for key, value in tech_mapping.items():
                    if key in dep.lower():
                        technologies.add(value)
        
        # From GitHub languages
        if languages:
            lang_mapping = {
                'JavaScript': 'JavaScript',
                'TypeScript': 'TypeScript',
                'Python': 'Python',
                'Java': 'Java',
                'Go': 'Go',
                'Rust': 'Rust',
                'C++': 'C++',
                'C': 'C',
                'HTML': 'HTML',
                'CSS': 'CSS',
                'PHP': 'PHP',
                'Ruby': 'Ruby',
                'Swift': 'Swift',
                'Kotlin': 'Kotlin'
            }
            
            for lang in languages.keys():
                if lang in lang_mapping:
                    technologies.add(lang_mapping[lang])
        
        # From README badges and mentions
        if readme_content:
            readme_lower = readme_content.lower()
            
            # Enhanced keywords including Chrome extension specific terms
            tech_keywords = [
                'react', 'vue', 'angular', 'svelte', 'express', 'flask',
                'django', 'fastapi', 'postgresql', 'mysql', 'mongodb',
                'redis', 'docker', 'kubernetes', 'aws', 'gcp', 'azure',
                'nodejs', 'python', 'java', 'golang', 'rust'
            ]
            
            # Chrome extension specific keywords
            chrome_keywords = {
                'chrome extension': 'Chrome Extension',
                'browser extension': 'Browser Extension', 
                'chrome web store': 'Chrome Extension',
                'manifest.json': 'Chrome Extension',
                'content script': 'Chrome Extension',
                'background script': 'Chrome Extension',
                'popup.html': 'Chrome Extension',
                'chrome api': 'Chrome Extension'
            }
            
            # Check for standard tech keywords
            for keyword in tech_keywords:
                if keyword in readme_lower:
                    technologies.add(keyword.title())
            
            # Check for Chrome extension specific terms
            for keyword, tech_name in chrome_keywords.items():
                if keyword in readme_lower:
                    technologies.add(tech_name)
        
        return ', '.join(sorted(technologies)) if technologies else ""
    
    def _extract_live_url(self, repo_data: Dict, readme_content: str) -> str:
        """Extract live demo URL from repository data or README."""
        # Check homepage field in repository
        homepage = repo_data.get('homepage', '')
        if homepage and homepage.startswith('http'):
            return homepage
        
        # Look for live demo links in README
        if readme_content:
            # Common patterns for demo/live links
            patterns = [
                r'(?:live demo|demo|website|deployed).*?https?://([^\s\)]+)',
                r'\[.*?(?:demo|live|website).*?\]\((https?://[^\)]+)\)',
                r'https?://[^\s]*\.(?:herokuapp|vercel|netlify|github\.io)[^\s]*'
            ]
            
            for pattern in patterns:
                matches = re.finditer(pattern, readme_content, re.IGNORECASE)
                for match in matches:
                    url = match.group(1) if len(match.groups()) > 0 else match.group(0)
                    if url.startswith('http'):
                        return url
        
        return ""
    
    def _extract_cover_image(self, readme_content: str, owner: str, repo: str) -> str:
        """Extract cover/banner image from README."""
        if not readme_content:
            return ""
        
        # Look for images in README
        img_patterns = [
            r'!\[.*?\]\((https?://[^\)]+\.(?:png|jpg|jpeg|gif|webp)[^\)]*)\)',  # Markdown images
            r'<img[^>]*src=["\']([^"\']*\.(?:png|jpg|jpeg|gif|webp)[^"\']*)["\'][^>]*>',  # HTML images
        ]
        
        images = []
        for pattern in img_patterns:
            matches = re.finditer(pattern, readme_content, re.IGNORECASE)
            for match in matches:
                images.append(match.group(1))
        
        # Prioritize images that look like banners/covers
        priority_keywords = ['banner', 'cover', 'hero', 'screenshot', 'demo', 'preview']
        
        for img_url in images:
            img_lower = img_url.lower()
            for keyword in priority_keywords:
                if keyword in img_lower:
                    return img_url
        
        # Return first image if any
        if images:
            return images[0]
        
        # Check for common screenshot locations
        screenshot_paths = [
            f"https://raw.githubusercontent.com/{owner}/{repo}/main/screenshot.png",
            f"https://raw.githubusercontent.com/{owner}/{repo}/main/demo.png",
            f"https://raw.githubusercontent.com/{owner}/{repo}/main/preview.png",
            f"https://raw.githubusercontent.com/{owner}/{repo}/master/screenshot.png"
        ]
        
        for path in screenshot_paths:
            try:
                response = requests.head(path, timeout=5)
                if response.status_code == 200:
                    return path
            except requests.RequestException:
                continue
        
        return ""