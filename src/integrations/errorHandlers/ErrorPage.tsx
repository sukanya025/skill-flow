import { useRouteError } from "react-router-dom";
import { useEffect } from "react";

// Mock error overlay
const ErrorOverlay = {
  sendErrorToParent: (error: Error, type: string) => {
    console.error(`[${type}] Error:`, error);
  },
  getOverlayHTML: () => {
    return `
      <div style="padding: 2rem; text-align: center; color: #dc2626;">
        <h2 style="margin-bottom: 1rem;">Something went wrong</h2>
        <p>An error occurred while loading this page.</p>
      </div>
    `;
  }
};

export default function ErrorPage() {
  const error = useRouteError() as Error;

  useEffect(() => {
    ErrorOverlay.sendErrorToParent(error, 'runtime');
  }, [error]);

  return (
    <div className="w-full h-full bg-white flex items-center justify-center gap">
      <div dangerouslySetInnerHTML={{ __html: ErrorOverlay.getOverlayHTML() }} />
    </div>
  );
}