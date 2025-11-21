import React from "react";
import { findAllByText, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

//O caba que nao quer testa na mao como os maias faziam, usam isso aqui embaixo, ai ai, esse programadores nutelas

import IMC from "./imc";

describe("IMC component", () => {
  it("renders inputs and button", () => {
    render(<IMC />);
    expect(screen.getByText("Peso (kg):")).toBeInTheDocument();
    expect(screen.getByText("Altura (m):")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Calcular IMC" })
    ).toBeInTheDocument();
  });

  it('shows "Abaixo do peso" for IMC < 18.5 and formats to two decimals', async () => {
    const user = userEvent.setup();
    render(<IMC />);
    const pesoInput = screen.getByPlaceholderText('Ex: 70.5');
    const alturaInput = screen.getByPlaceholderText('Ex: 1.75');
    const calcButton = screen.getByRole('button', { name: 'Calcular IMC' });
    await user.type(pesoInput, '45');
    await user.type(alturaInput, '1.75');
    await user.click(calcButton);
    const resultado = await screen.findByText((content, element) => {
      return (
        !!element?.classList.contains('resultado') &&
        content.includes('Abaixo do peso')
      );
    });
    expect(resultado).toBeInTheDocument();
  });

  it("classifies Peso normal, Sobrepeso and Obesidade categories correctly", async () => {
    render(<IMC />);
    const pesoInput = screen.getByPlaceholderText("Ex: 70.5");
    const alturaInput = screen.getByPlaceholderText("Ex: 1.75");
    const calcButton = screen.getByRole("button", { name: "Calcular IMC" });
    const user = userEvent.setup();


    // Peso normal(só os saudaveis)


    await user.type(pesoInput, '70');
    await user.type(alturaInput, '1.75');
    await user.click(calcButton);
    const resNormal = await screen.findByText((content, element) => {
      return (
        !!element?.classList.contains('resultado') && content.includes('Peso normal')
      );
    });
    expect(resNormal).toBeInTheDocument();

    // Sobrepeso (quem ta quase lá, mas n ta saudável, ta comendando besteira)

    await user.clear(pesoInput);
    await user.type(pesoInput, '80');
    await user.click(calcButton);
    const resSobrepeso = await screen.findByText((content, element) => {
      return (
        !!element?.classList.contains('resultado') && content.includes('Sobrepeso')
      );
    });


    expect(resSobrepeso).toBeInTheDocument();

    // Obesidade grau I (Quem sera que ta lendo isso que é obeso grau I?)
    await user.clear(pesoInput);
    await user.type(pesoInput, '95');
    await user.click(calcButton);
    const resObesidade = await screen.findByText((content, element) => {
      return (
        !!element?.classList.contains('resultado') && content.includes('Obesidade grau I')
      );
    });
    expect(resObesidade).toBeInTheDocument();
  });
 // Obesidade grau III(Muito obeso, tipo 150kg, quebra a perna)
  it("shows Obesidade grau III for very high IMC", async () => {
    render(<IMC />);
    const pesoInput = screen.getByPlaceholderText("Ex: 70.5");
    const alturaInput = screen.getByPlaceholderText("Ex: 1.75");
    const calcButton = screen.getByRole("button", { name: "Calcular IMC" });
    const user = userEvent.setup();


    await user.type(pesoInput, '150');
      await user.type(alturaInput, '1.60');
           await user.click(calcButton);


    const resultado = await screen.findByText((content, element) => {
      return (
        !!element?.classList.contains('resultado') &&
        content.includes('Obesidade grau III')
      );
    });

    expect(resultado).toBeInTheDocument();
  });




  it("shows error when peso is non-positive", async () => {
    const user = userEvent.setup();
    render(<IMC />);
    const pesoInput = screen.getByPlaceholderText('Ex: 70.5');
    const alturaInput = screen.getByPlaceholderText('Ex: 1.75');
    const calcButton = screen.getByRole('button', { name: 'Calcular IMC' });
    // preencher peso e altura antes de submeter
    await user.type(pesoInput, '0');
    await user.type(alturaInput, '1.75');
    await user.click(calcButton);
    const erro = await screen.findByText(/o peso deve ser um valor positivo/i);



    expect(erro).toBeInTheDocument();


  });

  it('shows error when altura is non-positive', async () => {
    const user = userEvent.setup();
    render(<IMC />);
    const pesoInput = screen.getByPlaceholderText('Ex: 70.5');
    const alturaInput = screen.getByPlaceholderText('Ex: 1.75');
    const calcButton = screen.getByRole('button', { name: 'Calcular IMC' });
    // preencher peso e altura (altura inválida) antes de submeter
    await user.type(pesoInput, '70');
    await user.type(alturaInput, '0');
    await user.click(calcButton);

    const erro = await screen.findByText(/a altura deve ser um valor positivo/i);
    expect(erro).toBeInTheDocument();

  });
  
  it("Validar mensagens de erro para entradas inválidas (peso ou altura não positivos)", async () => {
    const user = userEvent.setup();
    render(<IMC />);
    const pesoInput = screen.getByPlaceholderText('Ex: 70.5');
    const alturaInput = screen.getByPlaceholderText('Ex: 1.75');
    const calcButton = screen.getByRole('button', { name: 'Calcular IMC' });

    
    // Testar peso não positivo(ele flutua)

    await user.type(pesoInput, '-10');
    await user.type(alturaInput, '1.75');
    await user.click(calcButton);
    let erro = await screen.findByText(/o peso deve ser um valor positivo/i);
    expect(erro).toBeInTheDocument();


    // Testar altura não positiva(caboco cresceu pra baixo)


    await user.clear(pesoInput);
    await user.clear(alturaInput);
    await user.type(pesoInput, '70');
    await user.type(alturaInput, '-1.75');
    await user.click(calcButton);
    erro = await screen.findByText(/a altura deve ser um valor positivo/i);
    expect(erro).toBeInTheDocument();
  });
});