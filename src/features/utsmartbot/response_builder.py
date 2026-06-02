def build_local_response(message):
    text = message.lower()

    if any(word in text for word in ("hi", "hello", "hey")):
        return (
            "Hello! I am UTSmartBot, your friendly assistant for all things "
            "University of Technology Sarawak. How can I help you? :D"
        )

    if "course" in text or "offer" in text:
        return (
            "UTS offers programmes across computing, engineering, business, "
            "built environment, creative media, and foundation studies. For the "
            "latest course list, please refer to the official UTS website."
        )

    if any(word in text for word in ("fee", "tuition", "cost", "bcs")):
        return (
            "Tuition fees depend on the programme, study level, and student "
            "category. Please check the UTS fee schedule or contact admissions "
            "for the exact latest amount."
        )

    if any(word in text for word in ("email", "contact", "phone")):
        return (
            "For staff email or phone details, please use the official UTS staff "
            "directory. If an extension code is provided, add it after 084-367."
        )

    return (
        "I am running in local preview mode, so I can answer simple UTSmartBot "
        "demo questions. Ask about courses, fees, contacts, or the campus."
    )
