// Tab switching logic

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs and contents
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((tc) => tc.classList.remove("active"));

      // Add active class to clicked tab and related content
      tab.classList.add("active");
      const activeContent = document.getElementById(
        tab.getAttribute("data-tab")
      );
      if (activeContent) {
        activeContent.classList.add("active");
      }
    });
  });
});
