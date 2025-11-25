import readline from 'readline';

// Función genérica para hacer preguntas por consola
function hacerPregunta<T>(
    pregunta: string,
    procesarRespuesta: (respuesta: string) => T
): Promise<T> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(pregunta, (respuesta: string) => {
            rl.close();
            const resultado = procesarRespuesta(respuesta);
            resolve(resultado);
        });
    });
}

// Función helper para pedir confirmación por consola
export function pedirConfirmacion(pregunta: string): Promise<boolean> {
    return hacerPregunta(pregunta, (respuesta: string) => {
        const respuestaLower = respuesta.toLowerCase().trim();
        return respuestaLower === 'y';
    });
}

// Función helper para pedir un monto por consola
export function pedirMonto(pregunta: string): Promise<number> {
    return hacerPregunta(pregunta, (respuesta: string) => {
        const monto = parseFloat(respuesta.trim());
        if (isNaN(monto) || monto <= 0) {
            console.error('Por favor ingresa un monto válido mayor a 0');
            process.exit(1);
        }
        return monto;
    });
}