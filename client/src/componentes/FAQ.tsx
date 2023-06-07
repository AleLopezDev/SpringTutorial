import { useState } from "react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const questions = [
    {
      question: "¿Qué es React?",
      answer:
        "React es una biblioteca de JavaScript para construir interfaces de usuario.",
    },
    {
      question: "¿Qué es Tailwind CSS?",
      answer:
        "Tailwind CSS es un framework de CSS de utilidad de primera clase que te permite construir diseños personalizados directamente en tu HTML.",
    },
    {
      question: "¿Por qué no me da como completada la lección?",
      answer:
        "Asegúrate de que has completado correctamente el Mini-Test, al final de cada lección.",
    },
    {
      question: "¿Cómo puedo contactar con el profesor?",
      answer: "Puedes contactar con el profesor en el correo: admin@admin.com",
    },
    {
      question: "¿Cómo puedo obtener el certificado final?",
      answer:
        "Para obtener el certificado final debes completar el curso y ahcer el último examen.",
    },

    // Puedes agregar más preguntas aquí
  ];

  const handleClick = (index: any) => {
    if (index === activeIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className="p-4 mt-20 ml-72 max-w-5xl">
      <h2 className="text-2xl font-bold mb-6 text-left">
        Preguntas Frecuentes
      </h2>
      {questions.map((item, index) => (
        <div
          key={index}
          className="mb-6 bg-white shadow rounded overflow-hidden"
        >
          <div
            className="cursor-pointer px-6 py-5 font-bold text-lg bg-gray-100 border-b flex justify-between items-center"
            onClick={() => handleClick(index)}
          >
            {item.question}
            <span
              className={
                activeIndex === index
                  ? "transform rotate-45 transition-transform"
                  : "transition-transform"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </span>
          </div>
          {activeIndex === index && (
            <div className="px-6 py-5 text-gray-700">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
