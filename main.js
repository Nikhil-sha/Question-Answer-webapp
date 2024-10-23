window.addEventListener('beforeunload', function(event) {
	// This message will not be shown in modern browsers
	var confirmationMessage = 'Are you sure you want to leave this page?';
	event.preventDefault(); // Prevent the default behavior
	event.returnValue = confirmationMessage; // Most browsers will show a default message
	return confirmationMessage; // For some older browsers
});

// Function to fetch and load questions from JSON file
async function loadQuestions() {
	try {
		const response = await fetch('./questions.json');
		const questions = await response.json(); // Parse the JSON file

		const container = document.getElementById("question-container");
		container.innerHTML = ''; // Clear any previous content

		// Loop through the questions and create the UI elements
		questions.forEach(q => {
			const answer = localStorage.getItem(`answer_${q.id}`) || '';

			const questionElement = document.createElement("div");
			questionElement.classList.add("mb-6");

			questionElement.innerHTML = `
                <p class="text-lg font-semibold">• ${q.question}</p>
                <textarea id="answer_${q.id}" class="w-full p-2 border rounded-lg" placeholder="Type your answer here">${answer}</textarea>
            `;

			container.appendChild(questionElement);
		});
	} catch (error) {
		console.error("Error loading questions from JSON:", error);
	}
}

// Function to save answers to localStorage
function saveAnswers() {
	try {
		const questions = document.querySelectorAll('textarea');

		questions.forEach(question => {
			const id = question.id.split('_')[1]; // Extract question id from textarea id
			localStorage.setItem(`answer_${id}`, question.value);
		});

		alert("Answers saved successfully!");
	} catch (error) {
		console.error("Error saving answers to localStorage:", error);
		alert("Failed to save answers. Please try again.");
	}
}

// Function to print questions and answers using window.print()
function printQuestionsAndAnswers() {
	try {
		let printableContent = `
            <div>
                <h1 style="font-size: 24px; text-align: center;">Questions and Answers</h1>
        `;

		const questions = document.querySelectorAll('textarea');

		// Loop through each question and answer
		questions.forEach((question, index) => {
			const questionText = question.previousElementSibling.textContent; // Get the question text
			const answer = question.value || 'No answer provided';

			printableContent += `
                <p><strong>${index + 1}. ${questionText}</strong><br>Answer: ${answer}</p>
            `;
		});

		printableContent += '</div>';

		const printWindow = window.open('', '', 'width=800,height=600');
		printWindow.document.write(`
            <html>
            <head>
                <title>Print Questions and Answers</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { font-size: 24px; text-align: center; }
                    p { font-size: 16px; margin-bottom: 20px; }
                    @media print {
                        h1, p { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                ${printableContent}
            </body>
            </html>
        `);

		printWindow.print();
		printWindow.document.close();
		printWindow.onafterprint = function() {
			printWindow.close();
		};

	} catch (error) {
		console.error("Error printing questions and answers:", error);
		alert("Failed to print. Please try again.");
	}
}

// Add event listeners for saving and printing
document.getElementById('save-btn').addEventListener('click', saveAnswers);
document.getElementById('print-btn').addEventListener('click', printQuestionsAndAnswers);

// Load questions on page load
window.onload = loadQuestions;