'use strict';

// // Criamos um módulo Angular chamado listaContatos
var listaContatos = angular.module('gamaBlogApp', []);
 
function mainController($scope, $http) {  

    $scope.form = {};
     
    // Quando clicar no botão Criar, envia informações para a API Node
    $scope.criarContato = function() {
        $scope.form.data = new Date();
        $scope.form.ip = '192.0.0.1';

        $http.post('/contatos', $scope.form)
            .success(function(data) {
                // Limpa o formulário para criação de outros contatos
                $scope.formContato = {};
                $scope.contatos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });        
        
    }
}
