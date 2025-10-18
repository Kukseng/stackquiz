// // Example: React chatbot component

// const generateQuestions = async (userInput) => {
//   const response = await fetch('/api/v1/ai/quiz/chatbot/generate', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       topic: userInput.topic,
//       numberOfQuestions: userInput.count,
//       difficulty: userInput.difficulty,
//       questionType: 'MULTIPLE_CHOICE',
//       numberOfOptions: 4,
//       timeLimit: 30,
//       points: 100,
//       language: 'English',
//       includeExplanations: true
//     })
//   });
  
//   const data = await response.json();
  
//   if (data.success) {
//     // Store questions in state
//     setGeneratedQuestions(data.data.questions);
    
//     // Show to user
//     displayMessage(`✅ ${data.message}`);
//     displayQuestions(data.data.questions);
//   } else {
//     displayMessage(`❌ ${data.message}`);
//     displayMessage(`💡 ${data.suggestion}`);
//   }
// };

// const createQuizWithQuestions = async (questions, quizMetadata) => {
//   const response = await fetch('/api/v1/quizzes', {
//     method: 'POST',
//     headers: { 
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${authToken}`
//     },
//     body: JSON.stringify({
//       title: quizMetadata.title,
//       description: quizMetadata.description,
//       difficulty: quizMetadata.difficulty,
//       questionTimeLimit: 30,
//       questions: questions.map(q => ({
//         questionText: q.questionText,
//         questionType: q.questionType,
//         difficulty: q.difficulty,
//         points: q.points,
//         timeLimit: q.timeLimit,
//         options: q.options.map(opt => ({
//           optionText: opt.optionText,
//           isCorrect: opt.isCorrect
//         }))
//       }))
//     })
//   });
  
//   const data = await response.json();
//   displayMessage(`✅ Quiz created! ID: ${data.id}`);
// };