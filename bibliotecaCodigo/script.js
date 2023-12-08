carregarItensDaAPI();

// CLASSES

class EntidadeBibliografica {
    constructor(titulo, autor, anoPublicacao, codigo) {
        this.titulo = titulo;
        this.autor = autor;
        this.anoPublicacao = anoPublicacao;
        this.codigo = codigo;
        this.emprestado = false;
        this.usuarioEmprestimo = null;
    }

    emprestar(usuario) {
        if (!this.emprestado) {
            this.emprestado = true;
            this.usuarioEmprestimo = usuario;
            console.log(`Item ${this.codigo} emprestado para ${usuario.nome}`);
        } else {
            console.log(`Item ${this.codigo} já está emprestado`);
        }
    }

    devolver() {
        const operacoesDiv = document.getElementById("operacoes");

        if (this.emprestado) {
            this.emprestado = false;
            this.usuarioEmprestimo = null;
            atualizarMensagemDOM(`Item ${this.codigo} devolvido`, "blue");
            console.log(`Item ${this.codigo} devolvido`);
        } else {
            atualizarMensagemDOM(`Item ${this.codigo} não está emprestado`, "red");
            console.log(`Item ${this.codigo} não está emprestado`);
        }
    }
}

function atualizarMensagemDOM(mensagem, cor) {
    const operacoesDiv = document.getElementById("operacoes");
    operacoesDiv.innerHTML = `<span style="color: ${cor};">${mensagem}</span><br>`;
}


class Livro extends EntidadeBibliografica {
    constructor(titulo, autor, anoPublicacao, codigo, genero) {
        super(titulo, autor, anoPublicacao, codigo);
        this.genero = genero;
    }

    informacoes() {
        const status = this.emprestado ? "Emprestado" : "Disponível";
        return `${this.constructor.name} - Título: ${this.titulo}, Autor: ${this.autor}, Ano de Publicação: ${this.anoPublicacao}, Código: ${this.codigo}, Status: ${status}, Emprestado para: ${this.emprestado ? this.usuarioEmprestimo.nome : "Ninguém"}`;
    }
}

class Revista extends EntidadeBibliografica {
    constructor(titulo, autor, anoPublicacao, codigo, edicao) {
        super(titulo, autor, anoPublicacao, codigo);
        this.edicao = edicao;
    }

    informacoes() {
        const status = this.emprestado ? "Emprestado" : "Disponível";
        return `${this.constructor.name} - Título: ${this.titulo}, Editora: ${this.autor}, Ano de Publicação: ${this.anoPublicacao}, Código: ${this.codigo}, Status: ${status}, Emprestado para: ${this.emprestado ? this.usuarioEmprestimo.nome : "Ninguém"}`;
    }
}

class Usuario {
    constructor(nome, registroAcademico, dataNascimento) {
        this.nome = nome;
        this.registroAcademico = registroAcademico;
        this.dataNascimento = dataNascimento;
        this.statusEmprestimo = false;
    }

    informacoes() {
        const status = this.statusEmprestimo ? "Com item emprestado" : "Sem item emprestado";
        return `${this.constructor.name} - Nome: ${this.nome}, Registro Acadêmico: ${this.registroAcademico}, Data de Nascimento: ${this.dataNascimento}, Status: ${status}`;
    }
}
class Biblioteca {
    constructor() {
        this.acervo = [];
        this.usuarios = [];
    }

    adicionarItem(item) {
        this.acervo.push(item);
        console.log('Item adicionado ao acervo:', item);

        const operacoesDiv = document.getElementById("operacoes");
        operacoesDiv.innerHTML = `<span style="color: green;">Item ${item.codigo} <strong>(${item.titulo})</strong> adicionado ao acervo</span><br>`;
    }

    listarAcervo() {
        const operacoesDiv = document.getElementById("operacoes");
        this.acervo.forEach(item => {
            const statusEmprestimo = item.emprestado ? "Emprestado" : "Disponível";
            operacoesDiv.innerHTML += `<strong style="color: blue;">Nome:</strong> ${item.titulo}<br>
                                <span style="color: gray;">Autor:</span> ${item.autor}<br>
                                <span style="color: gray;">Ano de Publicação:</span> ${item.anoPublicacao}<br>
                                <span style="color: gray;">Código:</span> ${item.codigo}<br>
                                <span style="color: gray;">Autor/Edição:</span> ${item.autor}<br>
                                <span style="color: gray;">Status:</span> ${statusEmprestimo}<br><br>`;
        });

        console.log("Acervo da Biblioteca:");
        this.acervo.forEach(item => console.log(`${item.informacoes()}`));
    }

    listarUsuarios() {
        const operacoesDiv = document.getElementById("operacoes");
        operacoesDiv.innerHTML = "<span style='color: blue;'>Usuários da Biblioteca:</span><br>";

        this.usuarios.forEach(usuario => {
            const statusEmprestimo = usuario.statusEmprestimo ? "Com item emprestado" : "Sem item emprestado";
            const usuarioInfo = `- ${usuario.nome},<span style="color: gray;"> Registro Acadêmico:</span> ${usuario.registroAcademico}, ${statusEmprestimo}<br>`;
            operacoesDiv.innerHTML += usuarioInfo;
        });

        console.log("Usuários da Biblioteca:");
        this.usuarios.forEach(usuario => console.log(`${usuario.informacoes()}`));
    }

    adicionarUsuario(usuario) {
        this.usuarios.push(usuario);
        const operacoesDiv = document.getElementById("operacoes");
        operacoesDiv.innerHTML = `Usuário <span style='color: blue;'><strong>${usuario.nome}</strong></span> adicionado à biblioteca<br>`;
        console.log(`Usuário ${usuario.nome} adicionado à biblioteca`);
    }

    emprestarItem(codigo, registroAcademico) {
        const item = this.acervo.find(item => item.codigo === codigo);
        const operacoesDiv = document.getElementById("operacoes");
    
        if (item) {
            const usuarioEmprestimo = this.usuarios.find(user => user.registroAcademico === registroAcademico);
    
            if (usuarioEmprestimo) {
                item.emprestar(usuarioEmprestimo);
                operacoesDiv.innerHTML = `Item <span style="color: green;">${item.codigo} <strong>(${item.titulo})</strong></span> emprestado para <span style='color: blue;'><strong>${usuarioEmprestimo.nome}</strong></span><br>`;
                usuarioEmprestimo.statusEmprestimo = true;
            } else {
                operacoesDiv.innerHTML = "<span style='color: red;'>Usuário não encontrado</span><br>";
                console.log(`Usuário com registro acadêmico ${registroAcademico} não encontrado na biblioteca`);
            }
        } else {
            operacoesDiv.innerHTML = "<span style='color: red;'>Item não encontrado</span><br>";
            console.log(`Item com código ${codigo} não encontrado no acervo`);
        }
    }

    devolverItem(codigo) {
        const item = this.acervo.find(item => item.codigo === codigo);
        const operacoesDiv = document.getElementById("operacoes");

        if (item) {
            item.devolver();
        } else {
            operacoesDiv.innerHTML = "<span style='color: red;'>Item não encontrado</span><br>";
            console.log(`Item com código ${codigo} não encontrado no acervo`);
        }
    }
}

//------------------- API -------------------//

async function carregarItensDaAPI() {
    try {
        const response = await fetch("https://api-biblioteca-mb6w.onrender.com/acervo");
        const data = await response.json();

        data.forEach(item => {
            const constructor = item.entidadeBibliografica === "Livro" ? Livro : Revista;
            const bibliografica = new constructor(item.titulo, item.autor, item.anoPublicacao, item.codigo, item.genero || item.edicao);
            biblioteca.adicionarItem(bibliografica);
        });
    } catch (error) {
        const operacoesDiv = document.getElementById("operacoes");
        operacoesDiv.innerHTML = "Erro ao obter o acervo da API<br>";
        console.error("Erro ao obter o acervo da API:", error);
    }
}

const biblioteca = new Biblioteca();

// CADASTRO DE ITENS E USUÁRIOS

const usuario1 = new Usuario("João", "12345", "1995-12-25");
const usuario2 = new Usuario("Maria", "67890", "1990-06-15");
const usuario3 = new Usuario("Pedro", "54321", "2000-03-10");
const usuario4 = new Usuario("Ana", "09876", "1985-09-20");
const usuario5 = new Usuario("Lucas", "13579", "1998-11-30");

biblioteca.adicionarUsuario(usuario1);
biblioteca.adicionarUsuario(usuario2);
biblioteca.adicionarUsuario(usuario3);
biblioteca.adicionarUsuario(usuario4);
biblioteca.adicionarUsuario(usuario5);

const livro1 = new Livro("Aventuras de Jp", "Autor Jp", 2020, "L001", "Aventura");
biblioteca.adicionarItem(livro1);

// FUNÇÕES DE INTERAÇÃO COM O USUÁRIO

function adicionarItem() {
    const tipo = prompt("Digite o tipo do item (livro ou revista):");

    if (tipo === "livro") {
        const titulo = prompt("Digite o título do livro:");
        const autor = prompt("Digite o autor do livro:");
        const anoPublicacao = prompt("Digite o ano de publicação do livro:");
        const codigo = prompt("Digite o código do livro:");
        const genero = prompt("Digite o gênero do livro:");

        const livro = new Livro(titulo, autor, anoPublicacao, codigo, genero);
        biblioteca.adicionarItem(livro);
    } else if (tipo === "revista") {
        const titulo = prompt("Digite o título da revista:");
        const autor = prompt("Digite a editora da revista:");
        const anoPublicacao = prompt("Digite o ano de publicação da revista:");
        const codigo = prompt("Digite o código da revista:");
        const edicao = prompt("Digite a edição da revista:");

        const revista = new Revista(titulo, autor, anoPublicacao, codigo, edicao);
        biblioteca.adicionarItem(revista);
    } else {
        const operacoesDiv = document.getElementById("operacoes");
        operacoesDiv.innerHTML = "<span style='color: red;'>Tipo de item inválido</span><br>";
        console.log("Tipo de item inválido");
    }
}

function adicionarUsuario() {
    const nome = prompt("Digite o nome do usuário:");
    const registroAcademico = prompt("Digite o registro acadêmico do usuário:");
    const dataNascimento = prompt("Digite a data de nascimento do usuário (no formato YYYY-MM-DD):");

    const usuario = new Usuario(nome, registroAcademico, dataNascimento);
    biblioteca.adicionarUsuario(usuario);
}

function emprestarItem() {
    const codigo = prompt("Digite o código do item:");
    const registroAcademico = prompt("Digite o registro acadêmico do usuário:");

    biblioteca.emprestarItem(codigo, registroAcademico);
}

function devolverItem() {
    const codigo = prompt("Digite o código do item:");
    biblioteca.devolverItem(codigo);
}

function listarAcervo() {
    biblioteca.listarAcervo();
}

function listarUsuarios() {
    biblioteca.listarUsuarios();
}

function limpar() {
    const operacoesDiv = document.getElementById("operacoes");
    operacoesDiv.innerHTML = "";
}
