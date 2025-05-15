# Import the Console class from the rich library for styled terminal output
from rich.console import Console

# Create an instance of the Console class to enable styled printing
console = Console()


# Define the main function that runs when the script is executed
def main():
    # Print a styled rule (line) with a title
    console.rule("[bold blue]Resume Builder")

    # Print a welcome message in green text
    console.print("Welcome to your Python Resume Builder!", style="bold green")

    # Call the resume_input function to gather user info
    resume = resume_input()

    # Display the collected resume information
    console.print("\n[bold blue]Collected Resume Information:[/bold blue]")
    for key, value in resume.items():
        console.print(f"[bold]{key.capitalize()}:[/bold] {value}")


# Define the resume_input function to collect basic resume information
def resume_input():
    # Collect user information
    while True:
        res_name = input("Please enter your first and last name: ").strip()
        # Validate the name contains only letters, spaces, or hyphens
        if not res_name:
            print("Please provide a valid name.")
            continue
        if all(char.isalpha() or char in {" ", "-"} for char in res_name):
            break
        print("Please enter a valid name using letters, spaces, or hyphens only.")

    while True:
        res_email = input("What is your email address? ").strip()
        if not res_email:
            print("Please provide an email address.")
            continue
        if "@" in res_email and "." in res_email:
            break
        print("Please enter a valid email address.")

    while True:
        phone_number = input("What is your phone number? ").strip()
        if not phone_number:
            print("Please provide a phone number.")
            continue
        if phone_number.isdigit() and len(phone_number) == 10:
            break
        print("Please enter a valid 10-digit phone number.")

    while True:
        job_title = input("What is your desired job title? ").strip()
        if not job_title:
            print("Please provide a job title.")
            continue
        # Allow job titles with letters, spaces, hyphens, and special characters
        if all(char.isalnum() or char in {" ", "-", "+"} for char in job_title):
            break
        print("Please enter a valid job title.")

    # Store the collected info in a dictionary
    res_info = {
        "name": res_name,
        "email": res_email,
        "phone_number": phone_number,
        "job_title": job_title,
    }

    # Return the dictionary containing the user's resume info
    return res_info


# This block ensures the main function runs only when this file is executed directly
if __name__ == "__main__":
    main()
