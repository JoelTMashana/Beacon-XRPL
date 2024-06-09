export default function Chat() {
  // Sample messages array
  const messages = [
    { id: 1, sender: "Alice", text: "Really need some advice on how to survive Freshers' Week!" },
    { id: 2, sender: "Bob", text: "Keep it simple. Make sure you go to the introductory sessions, meet new people, and join a few societies that interest you." },
    { id: 3, sender: "Alice", text: "That makes sense. What about managing the workload?" },
    { id: 4, sender: "Bob", text: "Don’t stress too much yet. Focus on getting organised, keep track of your schedule, and don’t be afraid to ask for help if you need it." },
    { id: 5, sender: "Alice", text: "Thanks! Any tips on balancing social life and studies?" },
    { id: 6, sender: "Bob", text: "Yes, prioritise your time. Enjoy the social events but also set aside study time. Find a good balance early on." }
  ];

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg border shadow-md">
      <h1 className="text-lg font-semibold text-gray-900 mb-4">Chat</h1>
      <ul className="space-y-2">
        {messages.map(message => (
          <li key={message.id} className="bg-gray-100 p-3 rounded-md">
            <strong>{message.sender}:</strong> {message.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
