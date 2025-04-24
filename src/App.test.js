import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { AuthProvider } from "./Contexts/AuthContext";

const renderWithProvider = (ui, { loggedIn = false } = {}) => {
  if (loggedIn) {
    localStorage.setItem("userEmail", "test@example.com");
  } else {
    localStorage.removeItem("userEmail");
  }
  return render(<AuthProvider>{ui}</AuthProvider>);
};

describe("App (guest view)", () => {
  it("renders login page", async () => {
    renderWithProvider(<App />);

    userEvent.click(screen.getByRole("link", { name: "Log In" }));

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign up" })).toBeInTheDocument();
  });

  it("renders register page", async () => {
    renderWithProvider(<App />);

    userEvent.click(screen.getByRole("link", { name: "Sign Up" }));

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
  });

  it("renders only public navbar links for guests", () => {
    renderWithProvider(<App />);

    const visibleLinks = ["Home", "Masthead", "Submissions", "About"];
    visibleLinks.forEach((link) => {
      expect(screen.getByRole("link", { name: link })).toBeInTheDocument();
    });

    const hiddenLinks = ["Dashboard", "My Account", "View All People"];
    hiddenLinks.forEach((link) => {
      expect(
        screen.queryByRole("link", { name: link }),
      ).not.toBeInTheDocument();
    });

    // Check that the title link is also present
    expect(
      screen.getByRole("link", { name: "MMANKWGZRZ" }),
    ).toBeInTheDocument();
  });
});

describe("App (authenticated view)", () => {
  it("renders full navbar for logged-in user", () => {
    renderWithProvider(<App />, { loggedIn: true });

    const links = [
      "MMANKWGZRZ",
      "Home",
      "Dashboard",
      "Masthead",
      "Submissions",
      "About",
      "My Account",
      "View All People",
    ];

    links.forEach((link) => {
      expect(screen.getByRole("link", { name: link })).toBeInTheDocument();
    });
  });

  it("switches to Dashboard view", async () => {
    renderWithProvider(<App />, { loggedIn: true });

    userEvent.click(screen.getByRole("link", { name: "Dashboard" }));

    expect(screen.getByRole("heading", { name: "To Do" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "My Submissions" }),
    ).toBeInTheDocument();
  });

  it("switches to Masthead view", async () => {
    renderWithProvider(<App />, { loggedIn: true });

    userEvent.click(screen.getByRole("link", { name: "Masthead" }));

    expect(
      screen.getByRole("heading", { name: "Editors" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Managing Editors" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Consulting Editors" }),
    ).toBeInTheDocument();
  });

  it("switches to People view", async () => {
    renderWithProvider(<App />, { loggedIn: true });

    userEvent.click(screen.getByRole("link", { name: "View All People" }));

    expect(
      screen.getByRole("button", { name: "Add a Person" }),
    ).toBeInTheDocument();
  });

  it("loads AddPersonForm", async () => {
    renderWithProvider(<App />, { loggedIn: true });

    userEvent.click(screen.getByRole("link", { name: "View All People" }));
    userEvent.click(screen.getByRole("button", { name: "Add a Person" }));

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Affiliation")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
});
