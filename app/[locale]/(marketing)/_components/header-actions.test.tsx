import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { HeaderActions } from "./header-actions.client";

interface SessionState {
  data: { user: { name: string; image: string | null } } | null;
  isPending: boolean;
}

const { useSession, router } = vi.hoisted(() => ({
  useSession: vi.fn<() => SessionState>(),
  router: { replace: vi.fn() },
}));

vi.mock("@/lib/auth/auth-client", () => ({ useSession }));
// The real dropdown pulls in the sign-out hook; only its presence matters.
vi.mock("@/components/layout/user-dropdown.client", () => ({
  UserDropdown: () => <button type="button">Account menu</button>,
}));
vi.mock("@/i18n/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/i18n/navigation")>()),
  useRouter: () => router,
  usePathname: () => "/",
}));

function renderHeaderActions(session: SessionState) {
  useSession.mockReturnValue(session);
  return render(<HeaderActions />, { wrapper: IntlTestProvider });
}

const languageSelect = () =>
  screen.queryByRole("combobox", { name: "Language" });
const signInLink = () => screen.queryByRole("link", { name: "Sign In" });

describe("HeaderActions", () => {
  it("renders nothing while the session is loading", () => {
    const { container } = renderHeaderActions({ data: null, isPending: true });

    expect(container).toBeEmptyDOMElement();
  });

  it("offers guests the language picker to the left of the auth links", () => {
    renderHeaderActions({ data: null, isPending: false });

    const select = screen.getByRole("combobox", { name: "Language" });
    const signIn = screen.getByRole("link", { name: "Sign In" });
    expect(signIn).toHaveAttribute("href", "/en/login");
    expect(screen.getByRole("link", { name: "Sign Up" })).toHaveAttribute(
      "href",
      "/en/register",
    );
    // Document order is the visual order in the left-to-right flex row.
    const signInPosition = select.compareDocumentPosition(signIn);
    expect(signInPosition & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("shows signed-in users their menu without the picker or auth links", () => {
    renderHeaderActions({
      data: { user: { name: "Ann", image: null } },
      isPending: false,
    });

    expect(
      screen.getByRole("button", { name: "Account menu" }),
    ).toBeInTheDocument();
    expect(languageSelect()).not.toBeInTheDocument();
    expect(signInLink()).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Sign Up" }),
    ).not.toBeInTheDocument();
  });
});
