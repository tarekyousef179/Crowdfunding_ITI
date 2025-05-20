import { User } from "../javascript/models/User.js";

const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!currentUser || currentUser.role !== "student") {
  window.location.href = "login.html";
}

const getTotalSum = (requests) =>
  requests.reduce((acc, { amount }) => acc + Number(amount), 0);

const calculateApprovedRequests = (requests) => {
  const approvedRequests = requests.filter(({ status }) => status === "Approved");
  return getTotalSum(approvedRequests);
};

const convertImageToBase64 = (inputElement) => {
  return new Promise((resolve, reject) => {
    const file = inputElement.files[0];
    if (!file) return reject("No file selected");
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject("Error reading file: " + error);
    reader.readAsDataURL(file);
  });
};

const renderRequests = async (userId) => {
  const requests = await User.findRequestByUserId(userId);
  const mainContent = document.getElementById("main-content");

  if (!requests.length) {
    mainContent.innerHTML = `
      <h3>My Campaigns</h3>
      <p>You haven't any request yet.</p>
    `;
    return;
  }

  const rows = requests.map(({ requestType, date, status, description, amount }) => `
    <tr>
      <td>${requestType}</td>
      <td>${date}</td>
      <td><span class="badge ${status === 'Approved' ? 'bg-success' : status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'}">${status}</span></td>
      <td>${description}</td>
      <td>$${amount}</td>
    </tr>
  `).join("");

  mainContent.innerHTML = `
    <h3>My Campaigns</h3>
    <div class="table-responsive mt-4">
      <table class="table table-hover bg-white mt-3 rounded-3 shadow-sm">
        <thead class="table-light">
          <tr>
            <th>Request</th>
            <th>Date</th>
            <th>Status</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="mt-3">
      <h6>Total Approved Funding: <strong>$${calculateApprovedRequests(requests)}</strong></h6>
    </div>
  `;
};

const renderAccount = () => {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
    <h3>My Account</h3>
    <form id="accountForm" class="mt-4">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input type="text" id="username" class="form-control" value="${currentUser.username}" required />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" class="form-control" value="${currentUser.email || ''}" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" id="password" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Confirm Password</label>
        <input type="password" id="confirmPassword" class="form-control" required />
      </div>
      <div id="updateMessage" class="mt-3"></div>
       <div class="d-flex gap-2">
    <button type="submit" class="btn btn-primary">Update Account</button>
    <button type="button" class="btn btn-secondary" id="cancelAccountBtn">Cancel</button>
  </div>
    </form>
    

    
  `;

  const form = document.getElementById("accountForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      document.getElementById("updateMessage").innerHTML = `
        <div class="alert alert-danger">Passwords do not match.</div>
      `;
      return;
    }

    const updatedUser = {
      username,
      email,
      password,
    };

    try {
      const res = await fetch(`http://localhost:3000/users/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) throw new Error("Failed to update user");

      const updatedUserData = { ...currentUser, ...updatedUser };
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUserData));

      const nameElement = document.getElementById("studentName");
      if (nameElement) nameElement.textContent = updatedUser.username;

      document.getElementById("updateMessage").innerHTML = `
        <div class="alert alert-success">Account updated successfully.</div>
      `;
      form.reset();
    } catch (error) {
      document.getElementById("updateMessage").innerHTML = `
        <div class="alert alert-danger">Error updating account. Try again later.</div>
      `;
    }
  });
   document.getElementById("cancelAccountBtn").addEventListener("click", () => {
    document.getElementById("username").value = currentUser.username;
    document.getElementById("email").value = currentUser.email || '';
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
    document.getElementById("updateMessage").innerHTML = "";
  });
};

document.addEventListener("DOMContentLoaded", function () {
  const { username, id } = currentUser;
  const studentNameEl = document.getElementById("studentName");
  if (studentNameEl) studentNameEl.textContent = username;

  const mainContent = document.getElementById("main-content");
  const navLinks = document.querySelectorAll(".nav-link");
  const badgeRequests = document.getElementById("badgeRequests");

  async function updateBadge() {
    try {
      const res = await fetch(`http://localhost:3000/requests?studentId=${currentUser.id}`);
      const data = await res.json();
      if (badgeRequests) {
        badgeRequests.textContent = data.length > 0 ? data.length : "";
      }
    } catch {
      if (badgeRequests) badgeRequests.textContent = "";
    }
  }

  async function renderHome() {
    mainContent.innerHTML = `<h3>Welcome, ${username}</h3>
      <h5 class="mb-3">Your Funded Campaigns</h5>
      <div class="row g-4" id="funded-cards"></div>`;

    try {
      const response = await fetch(`http://localhost:3000/fundedRequests?studentId=${id}`);
      const fundedRequests = await response.json();
      const container = document.getElementById('funded-cards');

      if (fundedRequests.length === 0) {
        container.innerHTML = `<p>No funded requests yet.</p>`;
        return;
      }

      fundedRequests.forEach(req => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        card.innerHTML = `
          <div class="card shadow-lg rounded-3">
            <img src="${req.image}" class="card-img-top" alt="${req.type}">
            <div class="card-body">
              <h5>${req.type}</h5>
              <p>${req.description}</p>
              <strong>$${req.amount}</strong><br>
              <small>${new Date(req.date).toLocaleDateString()}</small>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    } catch (error) {
      console.error('Error loading funded requests:', error);
      document.getElementById('funded-cards').innerHTML = `<p class="text-danger">Error loading data.</p>`;
    }
  }

  function renderNewRequest() {
      mainContent.innerHTML = `
      <h3>Submit a New campaign</h3>
      <form id="newRequestForm" class="mt-4 needs-validation" novalidate>
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="campaignType" class="form-label">Type of Request</label>
            <select id="campaignType" class="form-select" required>
              <option value="" disabled selected>Select type</option>
              <option value="Scholarship">Study abroad</option>
              <option value="Course">Course</option>
              <option value="Supplies">learning Equipment</option>
              <option value="Supplies">university tuition</option>
            </select>
            <div class="invalid-feedback">Please select a request type.</div>
          </div>
          <div class="col-md-6">
            <label for="campaignImage" class="form-label">Upload an Image</label>
            <input type="file" id="campaignImage" class="form-control" accept="image/*" required />
            <div class="invalid-feedback">Please upload an image.</div>
          </div>
        </div>

        <div class="mb-3">
          <label for="requestReason" class="form-label">Why do you need this request?</label>
          <textarea id="requestReason" class="form-control" rows="3" required></textarea>
          <div class="invalid-feedback">Please provide a description.</div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label for="campaignDeadline" class="form-label">Deadline</label>
            <input type="date" id="campaignDeadline" class="form-control" required />
            <div class="invalid-feedback">Please set a deadline.</div>
          </div>
          <div class="col-md-6">
            <label for="campaignAmount" class="form-label">GOAL ($)</label>
            <input type="number" id="campaignAmount" class="form-control" min="1" required />
            <div class="invalid-feedback">Please enter a valid amount.</div>
          </div>
        </div>

        <div class="mt-3 d-flex gap-2">
          <button type="submit" class="btn btn-primary"><i class="bi bi-send"></i> Submit Request</button>
          <button type="button" id="cancelRequestBtn" class="btn btn-secondary">Cancel Request</button>
        </div>
      </form>
    `;

    const form = document.getElementById("newRequestForm");
    const savedFormData = JSON.parse(localStorage.getItem("newRequestData")) || {};

    document.getElementById("campaignType").value = savedFormData.requestType || "";
    document.getElementById("requestReason").value = savedFormData.description || "";
    document.getElementById("campaignDeadline").value = savedFormData.deadline || "";
    document.getElementById("campaignAmount").value = savedFormData.amount || "";

    const updateLocalStorage = () => {
      const data = {
        requestType: document.getElementById("campaignType").value,
        description: document.getElementById("requestReason").value,
        deadline: document.getElementById("campaignDeadline").value,
        amount: document.getElementById("campaignAmount").value,
      };
      localStorage.setItem("newRequestData", JSON.stringify(data));
    };

    ["campaignType", "requestReason", "campaignDeadline", "campaignAmount"].forEach((id) => {
      document.getElementById(id).addEventListener("input", updateLocalStorage);
    });

    document.getElementById("cancelRequestBtn").addEventListener("click", () => {
      form.reset();
      form.classList.remove("was-validated");
      localStorage.removeItem("newRequestData");
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      form.classList.add("was-validated");
      if (!form.checkValidity()) return;

      const imageInput = document.getElementById("campaignImage");
      let base64Image = "";

      try {
        base64Image = await convertImageToBase64(imageInput);
      } catch (err) {
        imageInput.classList.add("is-invalid");
        return;
      }

      const newRequest = {
        requestType: document.getElementById("campaignType").value,
        date: new Date().toLocaleDateString(),
        status: "Pending",
        description: document.getElementById("requestReason").value,
        amount: parseFloat(document.getElementById("campaignAmount").value).toFixed(2),
        image: base64Image,
        studentId: currentUser.id,
      };

      try {
        const response = await fetch("http://localhost:3000/requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newRequest),
        });

        if (!response.ok) throw new Error("Failed to save request");

        localStorage.removeItem("newRequestData");
        await updateBadge();
        setActiveNav("requests");

        const tableBody = document.querySelector("tbody");
        if (tableBody) {
          const newRow = document.createElement("tr");
          newRow.innerHTML = `
            <td>${newRequest.requestType}</td>
            <td>${newRequest.date}</td>
            <td><span class="badge bg-warning text-dark">Pending</span></td>
            <td>${newRequest.description}</td>
            <td>$${newRequest.amount}</td>
          `;
          tableBody.appendChild(newRow);
        } else {
          await renderRequests(currentUser.id);
        }
      } catch (error) {
        console.error("Error saving request:", error);
        alert("Failed to submit request. Please try again.");
      }
    });

    
  }

  function setActiveNav(section) {
    navLinks.forEach(link => {
      link.classList.toggle("active", link.dataset.section === section);
    });
  }

  navLinks.forEach(link => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      setActiveNav(section);
      if (section === "home") {
        renderHome();
      } else if (section === "requests") {
        await renderRequests(id);
      } else if (section === "new") {
        renderNewRequest();
      } else if (section === "account") {
        renderAccount();
      }
    });
  });

  document.querySelector('.nav-link.text-danger')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  });

  updateBadge();
  renderHome();
});







        