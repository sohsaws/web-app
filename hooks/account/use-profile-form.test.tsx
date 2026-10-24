import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProfileFormValues } from "@/lib/config/profile";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { useProfileForm } from "./use-profile-form";

const { updateProfile, router, toast } = vi.hoisted(() => ({
  updateProfile: vi.fn(),
  router: { refresh: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/actions/profile.action", () => ({ updateProfile }));
vi.mock("@/i18n/navigation", () => ({ useRouter: () => router }));
vi.mock("sonner", () => ({ toast }));

const savedProfile: ProfileFormValues = { name: "Ann", bio: "Likes hiking." };

function renderProfileHook() {
  return renderHook(
    () => {
      const profileForm = useProfileForm(savedProfile);
      // React Hook Form tracks isDirty only once it is read during render, as
      // the real form does for its Save button.
      void profileForm.form.formState.isDirty;
      return profileForm;
    },
    { wrapper: IntlTestProvider },
  );
}

async function submit(
  result: { current: ReturnType<typeof useProfileForm> },
  values: ProfileFormValues,
): Promise<void> {
  await act(async () => {
    result.current.form.setValue("name", values.name, { shouldDirty: true });
    result.current.form.setValue("bio", values.bio, { shouldDirty: true });
    await result.current.form.handleSubmit(result.current.onSubmit)();
  });
}

beforeEach(() => {
  updateProfile.mockResolvedValue({ success: true });
});

describe("useProfileForm", () => {
  it("saves the profile, makes it the new saved state and refreshes", async () => {
    const { result } = renderProfileHook();

    await submit(result, { name: "Ann Lee", bio: "Likes climbing." });

    expect(updateProfile).toHaveBeenCalledWith({
      name: "Ann Lee",
      bio: "Likes climbing.",
    });
    expect(toast.success).toHaveBeenCalledWith("Profile updated successfully");
    expect(router.refresh).toHaveBeenCalled();
    // After a save, "Cancel" must not bring back the old values.
    expect(result.current.form.formState.isDirty).toBe(false);
    expect(result.current.form.getValues()).toEqual({
      name: "Ann Lee",
      bio: "Likes climbing.",
    });
  });

  it.each([
    ["a blank name", { name: "  ", bio: "" }],
    ["a bio over 2000 characters", { name: "Ann", bio: "a".repeat(2001) }],
  ])("does not call the server for %s", async (_case, values) => {
    const { result } = renderProfileHook();

    await submit(result, values);

    expect(updateProfile).not.toHaveBeenCalled();
  });

  it("keeps the edits and shows the translated refusal when saving is refused", async () => {
    updateProfile.mockResolvedValue({
      success: false,
      code: "NOT_SIGNED_IN",
    });
    const { result } = renderProfileHook();

    await submit(result, { name: "Ann Lee", bio: "" });

    expect(toast.error).toHaveBeenCalledWith(
      "You must be signed in to do this.",
    );
    expect(router.refresh).not.toHaveBeenCalled();
    expect(result.current.form.getValues("name")).toBe("Ann Lee");
    expect(result.current.form.formState.isDirty).toBe(true);
  });

  it("shows a generic error when the request fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    updateProfile.mockRejectedValue(new Error("offline"));
    const { result } = renderProfileHook();

    await submit(result, { name: "Ann Lee", bio: "" });

    expect(toast.error).toHaveBeenCalledWith(
      "Something went wrong. Please try again.",
    );
  });

  it("resets unsaved edits back to the saved profile", () => {
    const { result } = renderProfileHook();

    act(() => {
      result.current.form.setValue("name", "Draft", { shouldDirty: true });
      result.current.resetForm();
    });

    expect(result.current.form.getValues()).toEqual(savedProfile);
  });
});
