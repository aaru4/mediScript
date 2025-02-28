# mediScript
MediScript is a custom-built, domain-specific language designed to make coding accessible to non-technical healthcare professionals. It allows doctors, nurses, and medical researchers to automate tasks, analyze patient data, and define AI-driven workflows without needing advanced programming knowledge.

By using simple, readable syntax, MediScript democratizes AI and automation in healthcare, helping medical professionals focus on patient care instead of complex code.

Scenario
A doctor wants to create a simple AI assistant that checks patient symptoms and recommends whether further testing is needed.

record patient as {

    name: "John Doe",
    age: 30
    
}

assess symptoms needs {

    fever: true,
    cough: false,
    fatigue: true
    
}

if symptoms.fever or symptoms.fatigue {

    prescribe "Further tests needed"
    
} else {

    prescribe "No immediate concern"
    
}
