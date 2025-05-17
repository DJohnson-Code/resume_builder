# Import the Console class from the rich library for styled terminal output
from rich.console import Console

# Create an instance of the Console class to enable styled printing
console = Console()


def main():
    console.rule("[bold blue]Resume Builder")
    console.print("Welcome to your Python Resume Builder!", style="bold green")

    # Collect user input
    name = get_name()
    email = get_email()
    phone = get_number()
    urls = get_urls()

    # Build the resume dictionary
    resume = {
        "name": name,
        "email": email,
        "phone_number": phone,
    }
    resume.update(urls)  # Merge optional URLs

    # Display the collected resume information
    console.print("\n[bold blue]Collected Resume Information:[/bold blue]")
    for key, value in resume.items():
        console.print(f"[bold]{key.capitalize()}:[/bold] {value}")


def get_name():
    while True:
        res_name = input("Enter your name: ").strip()

        if not res_name:
            print("You must enter your name.")
            continue

        if all(char.isalpha() or char in (" ", "-") for char in res_name):
            return res_name

        print("Please enter a valid name (letters, spaces, or hyphens only).")


def get_number():
    while True:
        res_number = input("Enter your phone number: ").strip()

        digits = res_number.replace("-", "").replace(" ", "")

        if digits.isdigit() and len(digits) == 10:

            if res_number.isdigit() or (
                len(res_number) == 12
                and res_number[3] == res_number[7] == "-"
                and res_number[:3].isdigit()
                and res_number[4:7].isdigit()
                and res_number[8:].isdigit()
            ):
                return res_number
        print("Enter a valid 10-digit phone number (e.g. 1234567890 or 123-456-7890).")


def get_email():
    while True:
        res_email = input("Email address: ")
        if not res_email:
            print("Enter your email address: ")
            continue
        if "@" in res_email and "." in res_email:
            return res_email
        print("Enter a valid email address: ")


def get_urls():
    urls = {}
    res_urls = [
        ("LinkedIn", "Enter your LinkedIn URL (or press Enter to skip): "),
        ("Website", "Enter your website URL (or press Enter to skip): "),
        ("GitHub", "Enter your GitHub URL (or press Enter to skip): "),
        ("YouTube", "Enter your YouTube URL (or press Enter to skip): "),
    ]

    for url_name, prompt in res_urls:
        while True:
            url = input(prompt).strip()
            if not url:
                break
            if (
                "http://" in url or "https://" in url or "www." in url
            ) and " " not in url:
                urls[url_name.lower()] = url  # ✅ fixed here
                break
            print(
                "Enter a valid URL (e.g., https://linkedin.com/in/username) or press Enter to skip."
            )

    return urls


# This block ensures the main function runs only when this file is executed directly
if __name__ == "__main__":
    main()
