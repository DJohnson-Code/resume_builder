from rich.console import Console

console = Console()


def main():
    console.rule("[bold blue]Resume Builder")
    console.print("Welcome to your Python Resume Builder!", style="bold green")

    resume = resume_input()


def resume_input():
    res_name = input("Please enter your first and last name:")
    res_email = input("What is your email address?")
    phone_number = input("What is your phone number?")
    job_title = input("What is your desired job title?")

    res_info = {
        "name": res_name,
        "email": res_email,
        "phone_number": phone_number,
        "job_title": job_title,
    }
    return res_info


if __name__ == "__main__":
    main()
