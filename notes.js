// frontend/js/notes.js

const API_URL = "http://localhost:5000/api/notes"; // backend API URL
const token = localStorage.getItem("token"); // JWT from login
const userId = localStorage.getItem("userId");

// Elements
const noteForm = document.getElementById("noteForm");
const notesList = document.getElementById("notesList");
const logoutBtn = document.getElementById("logoutBtn");

// 🔹 Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
}

// 🔹 Fetch notes
async function fetchNotes() {
  try {
    const res = await fetch(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const notes = await res.json();
    renderNotes(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
  }
}

// 🔹 Render notes on page
function renderNotes(notes) {
  notesList.innerHTML = "";
  if (!notes.length) {
    notesList.innerHTML = `<p class="text-gray-500">No notes yet. Add one above.</p>`;
    return;
  }
  notes.forEach((note) => {
    const noteCard = document.createElement("div");
    noteCard.className =
      "bg-white shadow rounded-lg p-4 flex flex-col justify-between";

    noteCard.innerHTML = `
      <h3 class="text-lg font-semibold text-blue-600">${note.title}</h3>
      <p class="text-gray-700 mt-2">${note.content}</p>
      <p class="text-sm text-gray-500 mt-1">Tags: ${note.tags?.join(", ") || "None"}</p>
      <div class="flex justify-end gap-2 mt-4">
        <button onclick="editNote('${note._id}', '${note.title}', '${note.content}', '${note.tags}')"
          class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
        <button onclick="deleteNote('${note._id}')"
          class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
      </div>
    `;
    notesList.appendChild(noteCard);
  });
}

// 🔹 Add new note
if (noteForm) {
  noteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const tags = document.getElementById("tags").value.split(",").map((t) => t.trim());

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, tags, userId }),
      });
      noteForm.reset();
      fetchNotes();
    } catch (err) {
      console.error("Error adding note:", err);
    }
  });
}

// 🔹 Delete note
async function deleteNote(id) {
  if (!confirm("Are you sure you want to delete this note?")) return;
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotes();
  } catch (err) {
    console.error("Error deleting note:", err);
  }
}

// 🔹 Edit note (simple prompt version)
async function editNote(id, title, content, tags) {
  const newTitle = prompt("Edit title:", title);
  const newContent = prompt("Edit content:", content);
  const newTags = prompt("Edit tags (comma separated):", tags);

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: newTitle,
        content: newContent,
        tags: newTags.split(",").map((t) => t.trim()),
      }),
    });
    fetchNotes();
  } catch (err) {
    console.error("Error editing note:", err);
  }
}

// 🔹 Load notes on page load
if (notesList) {
  fetchNotes();
}
