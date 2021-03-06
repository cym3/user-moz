Feature: Como cliente quero criar conta do usuário usando servidores de autorização

  Scenario: Autorizar acesso
    Dado que estou na endpoint criar conta usando servidores de autorização
    Quando solicitar criar conta do usuário 
    Então o sistema deve me direcionar o usuário para a pagina de autorização de acesso

  Scenario: Verificar o email
    Dado que email é valido
    Então o sistema deve confirmar se email pertence ao usuário

  Scenario: Salvar name e email
    Dado que o sistema tem acesso aos servidores dados do usuário
    Então o sistema deve solicitar nome e email do usuário
      E o sitema deve salvar o nome email do usuário
  
  Scenario: Dados de login
    Dado que o sistema tem acesso aos servidores dados do usuário
    Então o sistema deve criar Access Token com 10 minutos de validade
      E o sitema deve remover qualquer refresh Token que tiver
      E o sitema deve criar um novo refresh Token com 1 dias de validade
      E o sitema deve me retornar Access Token, nome e serviços do usuário

Feature: Como cliente quero criar conta do usuário usando dados do formulário

  Scenario: Validar dados do usuário
    Dado que estou na endpoint de criar conta
    Quando solicitar criar conta do usuário
    Então o sistema deve validar parâmentros da requisição
      E o sistema deve salvar os dados do usuário

  Scenario: Dados de login
    Dado que os dados foram salvos com sucesso
    Então o sistema deve criar Access Token com 10 minutos de validade
      E o sitema deve remover qualquer refresh Token que tiver
      E o sitema deve criar um novo refresh Token com 1 dias de validade
      E o sitema deve retornar Access Token, nome e serviços do usuário
  
  Scenario: Usuário já tem conta
    Dado que foi encontrado uma conta ja existente do usuário
    Então o sistema interrompe o processo
      E o sitema deve retornar o erro com mensagem "Oops!, já existe uma conta com este email."

  Scenario: Erro de validação
    Dado que foi encontrado erro na validação
    Então o sistema deve interromper o processo
      E o sitema deve retornar o erro


