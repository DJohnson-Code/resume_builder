# Import the Console class from the rich library for styled terminal output
from rich.console import Console
from archive_cli.input import (
    get_name,
    get_email,
    get_number,
    get_urls,
    get_experience,
    get_skills,
    get_education,
    display_resume,
)

# Create an instance of the Console class to enable styled printing
console = Console()


# Main function that runs when the script is executed
def main():
    # Print a styled title bar in the console
    console.rule("[bold blue]Resume Builder")

    # Print a welcome message
    console.print("Welcome to your Python Resume Builder!", style="bold green")

    # Collect required user input
    name = get_name()
    email = get_email()
    phone = get_number()
    urls = get_urls()
    experience = get_experience()
    skills = get_skills()
    education = get_education()

    # Build the resume dictionary with required info
    resume = {
        "name": name,
        "email": email,
        "phone_number": phone,
    }

    # Merge in the optional URLs if the user entered any
    resume["urls"] = urls
    resume["experience"] = experience
    resume["skills"] = skills
    resume["education"] = education

    console.rule("[bold green]Your Resume")

    display_resume(resume, console)


# Ensures that the main() function only runs when this file is run directly,
# not when it's imported by another file
if __name__ == "__main__":
    main()
