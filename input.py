from rich.console import Console


# Function to collect and validate the user's name
def get_name():
    while True:
        res_name = input("Enter your name: ").strip()  # Remove extra spaces

        # Require non-empty input
        if not res_name:
            print("You must enter your name.")
            continue

        # Check that all characters are letters, spaces, or hyphens
        if all(char.isalpha() or char in (" ", "-") for char in res_name):
            return res_name  # Return the valid name

        print("Please enter a valid name (letters, spaces, or hyphens only).")


# Function to collect and validate a 10-digit phone number
def get_number():
    while True:
        res_number = input("Enter your phone number: ").strip()

        # Remove hyphens and spaces for digit counting
        digits = res_number.replace("-", "").replace(" ", "")

        # Check that it contains exactly 10 digits
        if digits.isdigit() and len(digits) == 10:

            # Accept plain 10-digit numbers or properly formatted with dashes
            if res_number.isdigit() or (
                len(res_number) == 12
                and res_number[3] == res_number[7] == "-"
                and res_number[:3].isdigit()
                and res_number[4:7].isdigit()
                and res_number[8:].isdigit()
            ):
                return res_number  # Return the valid phone number

        print("Enter a valid 10-digit phone number (e.g. 1234567890 or 123-456-7890).")


# Function to collect and validate the user's email address
def get_email():
    while True:
        res_email = input("Email address: ")

        # Require non-empty input
        if not res_email:
            print("Enter your email address: ")
            continue

        # Basic check that the email contains @ and .
        if "@" in res_email and "." in res_email:
            return res_email  # Return the valid email

        print("Enter a valid email address: ")


# Function to collect optional profile links (LinkedIn, GitHub, etc.)
def get_urls():
    urls = {}  # Dictionary to store each profile if provided

    # List of tuples: (profile name, prompt to display)
    res_urls = [
        ("LinkedIn", "Enter your LinkedIn URL (or press Enter to skip): "),
        ("GitHub", "Enter your GitHub URL (or press Enter to skip): "),
        ("Website", "Enter your website URL (or press Enter to skip): "),
        ("YouTube", "Enter your YouTube URL (or press Enter to skip): "),
    ]

    # Loop over each profile prompt
    for url_name, prompt in res_urls:
        while True:
            url = input(prompt).strip()

            # If user presses Enter, skip this one
            if not url:
                break

            # Basic validation for URL-like input
            if (
                "http://" in url or "https://" in url or "www." in url
            ) and " " not in url:
                urls[url_name.lower()] = url  # Save the link using lowercase key
                break  # Move to the next profile prompt

            print(
                "Enter a valid URL (e.g., https://linkedin.com/in/username) or press Enter to skip."
            )
    return urls  # Return all collected URLs


def get_experience():
    experience = []

    while True:
        add_job = input("Would you like to add a job? (y/n): ").strip().lower()
        if not add_job:
            print("Please enter 'Y' or 'N'")
            continue
        if add_job != "y":
            break

        # Validate non-empty inputs
        job_title = input("Job title: ").strip()
        if not job_title:
            print("Job title cannot be empty.")
            continue

        company_name = input("Company name: ").strip()
        if not company_name:
            print("Company name cannot be empty.")
            continue

        job_duties = input("Job responsibilities and accomplishments: ").strip()
        if not job_duties:
            print("Job duties cannot be empty.")
            continue

        # Validate date format (e.g., YYYY or MM-YYYY)
        while True:
            start_date = input("Start date (YYYY or MM-YYYY): ").strip()
            if start_date.isdigit() and len(start_date) == 4:
                break  # Valid YYYY
            elif (
                len(start_date) == 7
                and start_date[2] == "-"
                and start_date[:2].isdigit()
                and start_date[3:].isdigit()
                and 1 <= int(start_date[:2]) <= 12
            ):
                break  # Valid MM-YYYY
            else:
                print("Enter a valid start date (YYYY or MM-YYYY).")

        while True:
            end_date = input("End date (or present) (YYYY or MM-YYYY): ").strip()
            if end_date.lower() == "present":
                break

            elif end_date.isdigit() and len(end_date) == 4:
                break

            elif (
                len(end_date) == 7
                and end_date[2] == "-"
                and 1 <= int(end_date[:2]) <= 12
                and end_date[:2].isdigit()
                and end_date[3:].isdigit()
            ):
                break
            else:
                print("Enter a valid end date (YYYY, MM-YYYY, or 'present').")

        job = {
            "job_title": job_title,
            "company_name": company_name,
            "job_duties": job_duties,
            "start_date": start_date,
            "end_date": end_date,
        }

        experience.append(job)

    return experience


def get_skills():
    while True:
        skills_input = input("Enter relevant skills (comma-separated): ").strip()

        if not skills_input:
            print("Please enter at least one skill.")
            continue

        # Split by commas, remove empty/extra spaces
        skills = [skill.strip() for skill in skills_input.split(",") if skill.strip()]

        if skills:
            return skills
        else:
            print("Please enter valid skills (e.g., Python, HTML, Git).")


def get_education():
    education = []

    while True:
        add_education = (
            input("Would you like to add education? (y/n): ").strip().lower()
        )
        if not add_education:
            print("Please enter 'Y' or 'N'")
            continue
        if add_education not in ["y", "n"]:
            print("Invalid input. Please enter 'Y' or 'N'")
            continue
        if add_education == "n":
            break

        # School name validation
        while True:
            school_name = input("School name: ").strip()
            if not school_name:
                print("School name cannot be empty. Please try again.")
                continue
            break

        # Degree validation
        while True:
            degree = input("Degree/Diploma: ").strip()
            if not degree:
                print("Degree/Diploma cannot be empty. Please try again.")
                continue
            break

        # Field of study validation (optional)
        field_of_study = input("Field of study (press Enter to skip): ").strip()

        # Graduation year validation
        while True:
            graduation_year = input("Graduation year: ").strip()
            if not graduation_year:
                print("Graduation year cannot be empty. Please try again.")
                continue

            # Check if it's a valid year format (either a 4-digit number or "Expected YYYY")
            if graduation_year.isdigit() and len(graduation_year) == 4:
                break
            elif (
                graduation_year.lower().startswith("expected ")
                and len(graduation_year) > 9
            ):
                expected_year = graduation_year.split(" ", 1)[1]
                if expected_year.isdigit() and len(expected_year) == 4:
                    break
            else:
                print("Please enter a valid year (YYYY) or 'Expected YYYY'.")
                continue
            break

        # Optional GPA validation
        while True:
            gpa = input("GPA (optional, press Enter to skip): ").strip()
            if not gpa:  # Empty is allowed for optional field
                break

            # Check if it's a valid GPA format (e.g., 3.5, 4.0)
            try:
                gpa_float = float(gpa)
                if 0 <= gpa_float <= 4.0:
                    break
                else:
                    print("GPA should be between 0.0 and 4.0. Please try again.")
            except ValueError:
                print("Please enter a valid GPA (e.g., 3.5) or press Enter to skip.")

        # Create education entry dictionary
        education_entry = {
            "school_name": school_name,
            "degree": degree,
        }

        # Only add optional fields if provided
        if field_of_study:
            education_entry["field_of_study"] = field_of_study

        education_entry["graduation_year"] = graduation_year

        if gpa:
            education_entry["gpa"] = gpa

        education.append(education_entry)
        print(f"Education entry for {school_name} added successfully!")

    return education


def display_resume(resume: dict, console: Console):
    console.rule("[bold green]Your Resume")
    for key, value in resume.items():
        console.print(f"\n[bold]{key.capitalize()}:[/bold]")
        if isinstance(value, list):
            for item in value:
                if isinstance(item, dict):
                    for sub_key, sub_value in item.items():
                        console.print(
                            f"  [bold]{sub_key.capitalize()}:[/bold] {sub_value}"
                        )
                    console.print("")
                else:
                    console.print(f"  - {item}")
        elif isinstance(value, dict):
            for sub_key, sub_value in value.items():
                console.print(f"  [bold]{sub_key.capitalize()}:[/bold] {sub_value}")
        else:
            console.print(f"{value}")
