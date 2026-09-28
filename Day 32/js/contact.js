/* ===== Contact page: form validation + success message ===== */
document.addEventListener("DOMContentLoaded", function () {
  const form = qs("#contactForm");
  const success = qs("#contactSuccess");

  function setError(id, message) {
    const msg = qs('[data-error="' + id + '"]');
    const input = qs("#" + id);
    if (msg) msg.textContent = message || "";
    if (input && input.closest(".field")) input.closest(".field").classList.toggle("invalid", Boolean(message));
  }

  function validate() {
    const errors = {};
    const name = qs("#cname").value.trim();
    const email = qs("#cemail").value.trim();
    const phone = qs("#cphone").value.trim();
    const subject = qs("#csubject").value;
    const message = qs("#cmessage").value.trim();

    if (name.length < 3) errors.cname = "Please enter your name (at least 3 characters).";
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) errors.cemail = "Enter a valid email address.";
    if (phone && !/^[+]?[\d\s()-]{8,18}$/.test(phone)) errors.cphone = "Enter a valid phone number or leave it blank.";
    if (!subject) errors.csubject = "Pick a topic so we can route your message.";
    if (message.length < 15) errors.cmessage = "Please give us a little more detail (15+ characters).";
    else if (message.length > 1000) errors.cmessage = "Please keep it under 1,000 characters.";

    ["cname", "cemail", "cphone", "csubject", "cmessage"].forEach(function (f) { setError(f, errors[f]); });
    return Object.keys(errors);
  }

  ["cname", "cemail", "cphone", "cmessage"].forEach(function (f) {
    qs("#" + f).addEventListener("blur", validate);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const invalid = validate();
    if (invalid.length) {
      qs("#" + invalid[0]).focus();
      toast("Please check the highlighted fields.");
      return;
    }

    const messages = Store.read("messages", []);
    messages.unshift({
      name: qs("#cname").value.trim(),
      email: qs("#cemail").value.trim(),
      phone: qs("#cphone").value.trim(),
      subject: qs("#csubject").value,
      message: qs("#cmessage").value.trim(),
      at: new Date().toISOString(),
    });
    Store.write("messages", messages);

    success.classList.remove("hidden");
    success.innerHTML =
      "<h3>Message sent</h3><p style=\"margin-top:8px\">Thanks " + qs("#cname").value.trim() +
      ", we've received your enquiry about “" + qs("#csubject").value +
      "”. A planner will reply to " + qs("#cemail").value.trim() + " within one working day.</p>";
    success.scrollIntoView({ behavior: "smooth", block: "center" });

    form.reset();
    toast("Thanks! Your message is on its way.");
  });
});
