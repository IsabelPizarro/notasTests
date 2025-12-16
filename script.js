// Respuestas correctas para cada asignatura
const correctAnswers = {
    procesos: {
        1: 'B', 2: 'C', 3: 'C', 4: 'C', 5: 'B',
        6: 'C', 7: 'D', 8: 'C', 9: 'B', 10: 'B',
        11: 'C', 12: 'D', 13: 'D', 14: 'B', 15: 'C',
        16: 'B', 17: 'B', 18: 'C', 19: 'B', 20: 'B',
        21: 'C', 22: 'C', 23: 'B', 24: 'C', 25: 'B',
        26: 'C', 27: 'C', 28: 'C', 29: 'C', 30: 'C'
    },
    sociedad: {
        1: 'C', 2: 'D', 3: 'D', 4: 'A', 5: 'B',
        6: 'B', 7: 'A', 8: 'D', 9: 'D', 10: 'C',
        11: 'A', 12: 'D', 13: 'B', 14: 'B', 15: 'D',
        16: 'D', 17: 'B', 18: 'B', 19: 'B', 20: 'A',
        21: 'C', 22: 'A', 23: 'D', 24: 'A', 25: 'A',
        26: 'D', 27: 'B', 28: 'B', 29: 'D', 30: 'C'
    },
    aprendizaje: {
        1: 'B', 2: 'D', 3: 'B', 4: 'B', 5: 'B',
        6: 'D', 7: 'B', 8: 'A', 9: 'D', 10: 'D',
        11: 'A', 12: 'C', 13: 'B', 14: 'A', 15: 'C',
        16: 'C', 17: 'D', 18: 'D', 19: 'D', 20: 'D',
        21: 'C', 22: 'B', 23: 'A', 24: 'A', 25: 'B',
        26: 'D', 27: 'C', 28: 'D', 29: 'A', 30: 'B'
    }
};

// Función para parsear las respuestas del alumno
function parseStudentAnswers(text) {
    const answers = {};
    const lines = text.split('\n');
    
    lines.forEach(line => {
        // Buscar patrón: número: letra
        const match = line.match(/(\d+)\s*:\s*([A-Da-d]?)/);
        if (match) {
            const questionNum = parseInt(match[1]);
            const answer = match[2].trim().toUpperCase();
            answers[questionNum] = answer || null; // null representa en blanco
        }
    });
    
    return answers;
}

// Función para calcular la nota
function calculateGrade(subject, studentAnswers) {
    const correctAnswersForSubject = correctAnswers[subject];
    let correct = 0;
    let incorrect = 0;
    let blank = 0;
    const details = [];
    
    // Evaluar las 30 preguntas
    for (let i = 1; i <= 30; i++) {
        const correctAnswer = correctAnswersForSubject[i];
        const studentAnswer = studentAnswers[i];
        
        let status;
        if (!studentAnswer) {
            blank++;
            status = 'blank';
        } else if (studentAnswer === correctAnswer) {
            correct++;
            status = 'correct';
        } else {
            incorrect++;
            status = 'incorrect';
        }
        
        details.push({
            question: i,
            correct: correctAnswer,
            student: studentAnswer || '-',
            status: status
        });
    }
    
    // Calcular puntuación: +1 por correcta, -0.33 por incorrecta, 0 por blanco
    const score = correct - (incorrect * 0.33);
    
    // Regla de 3: Si 30 = 10, entonces X = (correct * 10) / 30
    const notaSobre10 = (correct * 10) / 30;
    
    return {
        score: Math.max(0, score).toFixed(2), // No puede ser negativa
        notaSobre10: notaSobre10.toFixed(2),
        correct,
        incorrect,
        blank,
        details
    };
}

// Función para mostrar los resultados
function displayResults(results) {
    document.getElementById('finalScore').textContent = results.score;
    document.getElementById('notaSobre10').textContent = results.notaSobre10;
    document.getElementById('correctCount').textContent = results.correct;
    document.getElementById('incorrectCount').textContent = results.incorrect;
    document.getElementById('blankCount').textContent = results.blank;
    
    // Mostrar detalles de cada pregunta
    const detailsContainer = document.getElementById('detailsContainer');
    detailsContainer.innerHTML = '<h3 class="details-title">📋 Detalle por pregunta</h3>';
    
    results.details.forEach(detail => {
        const questionDiv = document.createElement('div');
        questionDiv.className = `question-detail ${detail.status}`;
        
        const statusText = {
            'correct': '✓ Correcta',
            'incorrect': '✗ Incorrecta',
            'blank': '○ En blanco'
        }[detail.status];
        
        questionDiv.innerHTML = `
            <div class="question-num">Pregunta ${detail.question}</div>
            <div>
                <span class="answer-label">Tu respuesta:</span>
                <span class="answer-value">${detail.student}</span>
            </div>
            <div>
                <span class="answer-label">Correcta:</span>
                <span class="answer-value">${detail.correct}</span>
            </div>
            <div class="status ${detail.status}">${statusText}</div>
        `;
        
        detailsContainer.appendChild(questionDiv);
    });
    
    // Mostrar sección de resultados
    document.getElementById('results').classList.remove('hidden');
    
    // Scroll suave a los resultados
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// Event listener para el botón de calcular
document.getElementById('calculateBtn').addEventListener('click', () => {
    const subject = document.getElementById('subject').value;
    const studentAnswersText = document.getElementById('studentAnswers').value;
    
    if (!subject) {
        alert('Por favor, selecciona una asignatura');
        return;
    }
    
    if (!studentAnswersText.trim()) {
        alert('Por favor, introduce las respuestas del alumno');
        return;
    }
    
    try {
        const studentAnswers = parseStudentAnswers(studentAnswersText);
        const results = calculateGrade(subject, studentAnswers);
        displayResults(results);
    } catch (error) {
        alert('Error al procesar las respuestas. Por favor, verifica el formato.');
        console.error(error);
    }
});

// Limpiar resultados al cambiar de asignatura o respuestas
document.getElementById('subject').addEventListener('change', () => {
    document.getElementById('results').classList.add('hidden');
});

document.getElementById('studentAnswers').addEventListener('input', () => {
    document.getElementById('results').classList.add('hidden');
});
