fetch("http://localhost:3000/campaigns")
  .then((response) => response.json())
  .then((campaigns) => {
    const campaignsContainer = document.getElementById("campaigns-container");
    campaigns.forEach((campaign) => {
      const campaignElement = document.createElement("div");
      campaignElement.classList.add("campaign");
      campaignElement.innerHTML = `
                        <h2>${campaign.title}</h2>
                        <p>${campaign.description}</p>
                        <p><strong>target:</strong> ${campaign.goal} </p>
                        <p><strong>deadline:</strong> ${campaign.deadline}</p>
                    `;
      campaignsContainer.appendChild(campaignElement);
    });
  })
  .catch((error) => console.error("Error loading campaigns:", error));
