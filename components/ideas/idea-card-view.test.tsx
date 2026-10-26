import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { IdeaCardView } from "./idea-card-view.client";

const IDEA = {
  id: "idea-1",
  title: "Night hike",
  description: "Walk a trail at dusk.",
  categories: [],
};

describe("IdeaCardView", () => {
  it("describes the illustration with the idea title", () => {
    render(
      <IdeaCardView {...IDEA} image="data:image/png;base64,iVBORw0KGgo=" />,
      {
        wrapper: IntlTestProvider,
      },
    );

    expect(
      screen.getByRole("img", { name: "Illustration for Night hike" }),
    ).toBeInTheDocument();
  });

  it("announces that the illustration is being generated", () => {
    render(<IdeaCardView {...IDEA} image={null} isImagePending />, {
      wrapper: IntlTestProvider,
    });

    expect(screen.getByRole("status")).toHaveTextContent(
      "Generating illustration...",
    );
  });
});
