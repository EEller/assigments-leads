'use strict';

// // Criamos um módulo Angular chamado listaContatos
var listaContatos = angular.module('gamaBlogApp', []);
 
function mainController($scope, $http) {  

    $scope.form = {};
         
    // Quando clicar no botão Criar, envia informações para a API Node
    $scope.criarContato = function() {
        
        if($scope.formLead.$invalid){
            if ($scope.formLead.$error.required){
                if ($scope.formLead.$error.required[0].$name == "nome"){
                    alert("Preencha o campo nome");
                } else if($scope.formLead.$error.required[0].$name == "sobrenome"){
                    alert("Preencha o campo sobrenome");
                } else if($scope.formLead.$error.required[0].$name == "email"){
                    alert("Preencha o campo email");
                }
            } else if($scope.formLead.$error.email){
                alert("Formato de email inválido")
            }
        }else {
            $scope.form.data = moment().format('YYYY-MM-DD HH:mm:ss');
            $scope.form.nome = $scope.form.nome+ ' ' +$scope.form.sobrenome;
            $http({
                method: 'GET',
                url: '//www.stupidwebtools.com/api/my_ip.json'
            }).then(function successCallback(response) {
                $scope.form.ip = response.data.my_ip.ip;
                $http.post('/contatos', $scope.form).success(function(data) {
                    $scope.form.nome = "";
                    $scope.form.sobrenome = "";
                    $scope.form.email = "";
                    alert("Obrigado, vc receberá o seu e-book via email.");
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(response);
            });
        }
        
    }
}