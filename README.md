# Signal Forms Registration Demo


[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/angular-buch/signal-forms-registration)


This is the demo application for our blog series about **Angular Signal Forms**:

- [Angular Signal Forms Part 1: Getting Started with the Basics](https://angular-buch.com/blog/2025-10-signal-forms-part1)
- [Angular Signal Forms Part 2: Advanced Validation and Schema Patterns](https://angular-buch.com/blog/2025-10-signal-forms-part2)
- [Angular Signal Forms Part 3: Child Forms, Custom UI Controls and SignalFormsConfig](https://angular-buch.com/blog/2025-10-signal-forms-part3)
- [Angular Signal Forms Part 4: Metadata and Accessibility Handling](https://angular-buch.com/blog/2025-12-signal-forms-part4)

You can try the demo application on StackBlitz or as a live demo on GitHub Pages:

- **⚡️ Stackblitz:** [https://stackblitz.com/github/angular-buch/signal-forms-registration](https://stackblitz.com/github/angular-buch/signal-forms-registration)
- **💻 Live Demo:** [https://angular-buch.github.io/signal-forms-registration/](https://angular-buch.github.io/signal-forms-registration/)

## Test WebMCP

1. Enable experimental Web MCP feature in the browser:

   ```text
   chrome://flags/#enable-webmcp-testing
   ```

2. Open [localhost:4200/version-4](http://localhost:4200/version-4)
3. Test the registered tool by calling it using `modelContextTesting` API:

  ```js
  const result = await navigator.modelContextTesting.executeTool(
    "registerUser",
    JSON.stringify({
      "username": "Hans",
      "identity": {
        "gender": "male",
        "salutation": "",
        "pronoun": ""
      },
      "age": 18,
      "password": {
        "pw1": "1234!uzab",
        "pw2": "1234!uzab"
      },
      "email": [
        "foo@bar.com"
      ],
      "newsletter": true,
      "newsletterTopics": [
        "Angular"
      ],
      "agreeToTermsAndConditions": true
    })
  );
  console.log(JSON.parse(result));
  ```
