document.addEventListener("DOMContentLoaded", function() {
    const pointsElement = document.getElementById("points");
    let points = 200;
    const redeemCode = { // Redeem codes object with multiple codes and their respective point values
        "BONUS100": 50,
        "quantumsync": 100,
        "dev": 10000
    };

    // Load stored points and check if daily reward has been claimed today
    const storedPoints = localStorage.getItem("points");
    if (storedPoints) {
        points = parseInt(storedPoints);
        pointsElement.textContent = `Points: ${points}`;
    }

    const lastClaimDate = localStorage.getItem("lastClaimDate");
    const today = new Date().toDateString();

    // Disable the daily reward button if the user has already claimed today
    if (lastClaimDate === today) {
        document.getElementById("claim-reward").disabled = true;
        document.getElementById("claim-reward").textContent = "Reward Claimed Today";
    }

    // Spin button functionality
    document.getElementById("spin-button").addEventListener("click", function() {
        if (points >= 10) {
            points -= 10; // Deduct points for spinning
            pointsElement.textContent = `Points: ${points}`;
            spinSlots();
        } else {
            showNotification("Not enough points to spin!");
        }
    });

    // Redeem code functionality
    document.getElementById("redeem-button").addEventListener("click", function() {
        const enteredCode = document.getElementById("redeem-code").value.trim().toLowerCase();
        
        // Check if the code has already been redeemed
        const redeemedCodes = JSON.parse(localStorage.getItem("redeemedCodes")) || [];
        if (redeemedCodes.includes(enteredCode)) {
            showNotification("You have already redeemed this code!");
            return; // Prevent redemption if the code was already used
        }

        // Check if the entered code exists in the redeemCode object
        if (redeemCode[enteredCode]) {
            points += redeemCode[enteredCode]; // Add the points for the redeem code
            pointsElement.textContent = `Points: ${points}`;
            showNotification(`${enteredCode} code redeemed! You received ${redeemCode[enteredCode]} points.`);

            // Save the redeemed code to localStorage to prevent future redemption
            redeemedCodes.push(enteredCode);
            localStorage.setItem("redeemedCodes", JSON.stringify(redeemedCodes));
            localStorage.setItem("points", points);
        } else {
            showNotification("Invalid redeem code!");
        }
    });

    // Claim daily reward functionality
    document.getElementById("claim-reward").addEventListener("click", function() {
        if (lastClaimDate === today) {
            showNotification("You've already claimed your daily reward today!");
        } else {
            points += 50; // Daily reward points
            pointsElement.textContent = `Points: ${points}`;
            showNotification("Daily reward claimed! You received 50 points.");
            localStorage.setItem("lastClaimDate", today); // Save today's date to prevent spamming
            localStorage.setItem("points", points);

            // Disable the button after claiming the reward
            document.getElementById("claim-reward").disabled = true;
            document.getElementById("claim-reward").textContent = "Reward Claimed Today";
        }
    });

    // Patch notes button functionality
    document.getElementById("patch-notes-button").addEventListener("click", function() {
        document.getElementById("patch-notes-modal").style.display = "block";
    });

    // Close patch notes modal
    document.getElementById("close-patch-notes").addEventListener("click", function() {
        document.getElementById("patch-notes-modal").style.display = "none";
    });

    // Game rules button functionality
    document.getElementById("rules-button").addEventListener("click", function() {
        document.getElementById("rules-modal").style.display = "block";
    });

    // Start game from rules modal
    document.getElementById("start-game").addEventListener("click", function() {
        document.getElementById("rules-modal").style.display = "none";
    });

    // Spin slots logic (this can be modified for random results)
    function spinSlots() {
        const slotSymbols = ["🍇", "🍒", "🍋", "🍉", "🍊"];
        const slot1 = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
        const slot2 = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
        const slot3 = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];

        document.getElementById("slot1").textContent = slot1;
        document.getElementById("slot2").textContent = slot2;
        document.getElementById("slot3").textContent = slot3;

        checkWin(slot1, slot2, slot3);
    }

    // Check if the player won
    function checkWin(slot1, slot2, slot3) {
        if (slot1 === slot2 && slot2 === slot3) {
            points += 100; // Jackpot!
            pointsElement.textContent = `Points: ${points}`;
            showNotification("Jackpot! You win 100 points!");
        } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
            points += 20; // Small win
            pointsElement.textContent = `Points: ${points}`;
            showNotification("Small win! You win 20 points.");
        } else {
            showNotification("No match, try again!");
        }
        localStorage.setItem("points", points);
    }

    // Show notification pop-up
    function showNotification(message) {
        const notification = document.getElementById("notification");
        notification.textContent = message;
        notification.style.display = "block";
        setTimeout(function() {
            notification.style.display = "none";
        }, 3000);
    }
});


