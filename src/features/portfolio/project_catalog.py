PROJECTS = [
    {
        "slug": "crop-yield",
        "number": "01",
        "title": "Crop Yield AI",
        "category": "Final Year Project",
        "year": "2025",
        "role": "End-to-End Development",
        "summary": "An AI platform for land suitability and crop yield assessment.",
        "background": "Flask, Supabase, image processing, machine learning, and dashboard workflows.",
        "short_description": (
            "Built in 2025, Crop Yield AI analyzes satellite or drone imagery "
            "to support land suitability review and crop yield estimation through "
            "a Supabase-supported dashboard."
        ),
        "url": "/projects/crop-yield/",
        "demo_url": "/projects/crop-yield/demo/",
        "status": "Interactive preview",
        "image": None,
        "visual_style": "crop-ai",
        "detail_variant": "ai",
        "workflow": [
            {
                "label": "Field Imagery",
                "text": "Users upload satellite or drone-style field images for analysis.",
            },
            {
                "label": "Feature Pipeline",
                "text": "The system extracts vegetation and colour features from the image.",
            },
            {
                "label": "Backend Flow",
                "text": "Supabase supports the project data flow without exposing private keys.",
            },
        ],
        "details": [
            "Built the upload, analysis, prediction, result display, and dashboard flow.",
            "Structured the project around image processing, model integration, and backend storage.",
            "Prepared a portfolio-safe preview that avoids exposing private keys or heavy model files.",
        ],
        "preview_stack": ["Python", "Flask", "Supabase", "HTML", "CSS", "JavaScript"],
        "stack": ["Python", "Flask", "Supabase", "HTML", "CSS", "JavaScript", "OpenCV", "scikit-learn"],
    },
    {
        "slug": "residential",
        "number": "02",
        "title": "168 Park Selayang",
        "category": "Residential Website",
        "year": "2025",
        "role": "Backend and Database",
        "summary": "A multi-page property website with gallery, floor plans, and brochures.",
        "background": "Original web pages with Supabase backend support, media assets, and brochures.",
        "short_description": (
            "A 2025 residential property website presenting 168 Park Selayang "
            "through landing pages, residence pages, floor plans, gallery media, "
            "contact pages, and Supabase-backed data flow."
        ),
        "url": "/projects/residential/",
        "demo_url": "/projects/residential/demo/",
        "status": "Original pages",
        "image": "/projects/residential/assets/home/park_selayang.jpg",
        "detail_variant": "property",
        "details": [
            "Supported the backend and database side for a full residential property website.",
            "Organized multi-page content for gallery, floor plans, residences, concepts, and contact flows.",
            "Kept the supplied images, videos, brochures, and original page interactions intact.",
        ],
        "preview_stack": ["HTML", "CSS", "JavaScript", "Supabase"],
        "stack": ["HTML", "CSS", "JavaScript", "Supabase", "Media Assets", "PDF Brochures"],
    },
    {
        "slug": "m4food",
        "number": "03",
        "title": "M4Food",
        "category": "MAUI Food Donation App",
        "year": "2025",
        "role": "Frontend Development",
        "summary": "A mobile app concept for browsing donated bakery items and managing orders.",
        "background": ".NET MAUI interface work, C# service wiring, sign-in flow, and local caching.",
        "short_description": (
            "A 2025 .NET MAUI food donation app concept where users can browse "
            "surplus bakery items, continue as guest, use Google sign-in, manage "
            "cart items, and view order flows."
        ),
        "url": "/projects/m4food/",
        "demo_url": "/projects/m4food/demo/",
        "status": "Portfolio showcase",
        "image": "/projects/m4food/assets/chococake.png",
        "visual_style": "m4food",
        "detail_variant": "app",
        "details": [
            "Focused on the front-end mobile experience and screen structure.",
            "Recreated the login and home app screens for a browser-based portfolio preview.",
            "Used the original food assets while keeping the showcase lightweight and easy to review.",
        ],
        "preview_stack": [".NET MAUI", "C#", "Firebase Sign-In"],
        "stack": [".NET MAUI", "C#", "Firebase Sign-In", "Image Upload Service", "SQLite Cache"],
    },
    {
        "slug": "utsmartbot",
        "number": "04",
        "title": "UTSmartBot",
        "category": "AI Chatbot",
        "year": "2024",
        "role": "Backend Integration",
        "summary": "A UTS-focused chatbot website built for quick university enquiries.",
        "background": "Flask web chatbot with Gemini AI integration and UTS-focused responses.",
        "short_description": (
            "Built in 2024 for TechMen's OOP coursework, UTSmartBot answers "
            "course, fee, contact, and university information questions through "
            "a simple web chat interface."
        ),
        "url": "/projects/utsmartbot/",
        "demo_url": "/projects/utsmartbot/demo/",
        "status": "Local demo",
        "image": None,
        "visual_style": "chatbot",
        "detail_variant": "chat",
        "details": [
            "Integrated the backend response flow for University of Technology Sarawak questions.",
            "Connected a Flask chat interface with Google's Gemini AI model.",
            "Focused on common student enquiries such as courses, tuition fees, contacts, and UTS information.",
        ],
        "preview_stack": ["Python", "Flask", "Gemini AI"],
        "stack": ["Python", "Flask", "Gemini AI", "HTML", "CSS", "JavaScript"],
    },
]


def get_project_by_slug(slug):
    return next((project for project in PROJECTS if project["slug"] == slug), None)
