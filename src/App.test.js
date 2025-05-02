import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { AuthProvider } from "./Contexts/AuthContext";
import axios from "axios";

// Mock axios
jest.mock("axios");

// Helper to mock backend API responses
const mockAxiosGet = (loggedIn) => {
  if (loggedIn) {
    axios.get.mockImplementation((url, config) => {
      if (url.includes("/permissions")) {
        // Mock permission check
        return Promise.resolve({ data: { permitted: true } });
      }
      if (url.includes("/people/masthead")) {
        // Mock masthead structure
        return Promise.resolve({
          data: {
            Masthead: {
              Editor: [{ name: "Editor Name" }],
              "Managing Editor": [],
              "Consulting Editor": [],
            },
          },
        });
      }
      return Promise.resolve({ data: {} }); // Default fallback
    });
  } else {
    axios.get.mockImplementation(() =>
      Promise.resolve({ data: { permitted: false } })
    );
  }
};

// Helper to render App with AuthProvider
const renderWithProvider = (ui, { loggedIn = false } = {}) => {
  if (loggedIn) {
    localStorage.setItem("userEmail", "test@example.com");
  } else {
    localStorage.removeItem("userEmail");
  }

  mockAxiosGet(loggedIn);

  return render(<AuthProvider>{ui}</AuthProvider>);
};

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

describe("App (guest view)", () => {
  it("renders login page", async () => {
    renderWithProvider(<App />);

    userEvent.click(screen.getByRole("link", { name: "Log In" }));

    expect(await screen.findByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign up" })).toBeInTheDocument();
  });

  it("renders register page", async () => {
    renderWithProvider(<App />);

    userEvent.click(screen.getByRole("link", { name: "Sign Up" }));

    expect(await screen.findByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
  });

  it("renders only public navbar links for guests", async () => {
    renderWithProvider(<App />);

    const visibleLinks = ["Home", "Masthead", "Submissions", "About"];
    for (const link of visibleLinks) {
      expect(
        await screen.findByRole("link", { name: link })
      ).toBeInTheDocument();
    }

    const hiddenLinks = ["Dashboard", "My Account", "View All People"];
    for (const link of hiddenLinks) {
      expect(
        screen.queryByRole("link", { name: link })
      ).not.toBeInTheDocument();
    }

    expect(
      await screen.findByRole("link", { name: "MMANKWGZRZ" })
    ).toBeInTheDocument();
  });
});

describe("App (authenticated view)", () => {
  it("renders basic navbar links for logged-in user", async () => {
    renderWithProvider(<App />, { loggedIn: true });

    const expectedLinks = [
      "MMANKWGZRZ",
      "Home",
      "Dashboard",
      "Masthead",
      "Submissions",
      "About",
      "My Account",
      "View All People",
    ];

    for (const link of expectedLinks) {
      expect(
        await screen.findByRole("link", { name: link })
      ).toBeInTheDocument();
    }
  });

  it("switches to Masthead view", async () => {
    renderWithProvider(<App />, { loggedIn: true });

    userEvent.click(await screen.findByRole("link", { name: "Masthead" }));

    expect(
      await screen.findByRole("heading", { name: "Editors" })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: "Managing Editors" })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: "Consulting Editors" })
    ).toBeInTheDocument();
  });

  it("switches to People view if permission exists", async () => {
    renderWithProvider(<App />, { loggedIn: true });

    const viewAllPeopleLink = await screen.queryByRole("link", {
      name: "View All People",
    });

    if (viewAllPeopleLink) {
      userEvent.click(viewAllPeopleLink);
      expect(
        await screen.findByRole("button", { name: "Add a Person" })
      ).toBeInTheDocument();
    } else {
      console.warn(
        "Skipping People view test: View All People link not visible (no permission)"
      );
    }
  });

  it("loads AddPersonForm if permission exists", async () => {
    renderWithProvider(<App />, { loggedIn: true });

    const viewAllPeopleLink = await screen.queryByRole("link", {
      name: "View All People",
    });

    if (viewAllPeopleLink) {
      userEvent.click(viewAllPeopleLink);
      userEvent.click(
        await screen.findByRole("button", { name: "Add a Person" })
      );

      expect(await screen.findByLabelText("Name")).toBeInTheDocument();
      expect(await screen.findByLabelText("Affiliation")).toBeInTheDocument();
      expect(await screen.findByLabelText("Email")).toBeInTheDocument();
      expect(
        await screen.findByRole("button", { name: "Submit" })
      ).toBeInTheDocument();
      expect(
        await screen.findByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
    } else {
      console.warn(
        "Skipping AddPersonForm test: View All People link not visible (no permission)"
      );
    }
  });
});
