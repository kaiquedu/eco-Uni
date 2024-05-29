import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home.js';
import HomeApp from '../screens/HomeApp.js';
import Login from '../screens/Login.js';
import Cadastro from '../screens/Cadastro.js';
import LoginUsuario from '../screens/LoginUsuario.js';
import EncontreConta from '../screens/EncontreConta.js';
import AutenticacaoConta from '../screens/AutenticacaoConta.js';
import ConfirmaSenha from '../screens/ConfirmaSenha.js'
import Relatorios from '../screens/Relatorios.js';
import Opcoes from '../screens/Opcoes.js';
import Perfil from '../screens/Perfil.js';
import Ajuda from '../screens/Ajuda.js';
import Contato from '../screens/Contato.js';
import RegistroColetaNaoReciclavel from '../screens/RegistroColetaNaoReciclavel.js';
import RegistroColetaReciclavel from '../screens/RegistroColetaReciclavel.js';
import RegistroColetaPapelReciclavel from '../screens/RegistroColetaPapelReciclavel.js';
import Termos from '../screens/Termos.js';
import Politica from '../screens/Politica.js';
import GerarRelatorios from '../screens/GerarRelatorios.js';
import Historico from '../screens/Historico.js';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro}/>
        <Stack.Screen name="LoginUsuario" component={LoginUsuario}/>
        <Stack.Screen name="EncontreConta" component={EncontreConta}/>
        <Stack.Screen name="AutenticacaoConta" component={AutenticacaoConta}/>
        <Stack.Screen name="ConfirmaSenha" component={ConfirmaSenha}/>
        <Stack.Screen name="HomeApp" component={HomeApp}/>
        <Stack.Screen name="Relatorios" component={Relatorios}/>
        <Stack.Screen name="Opcoes" component={Opcoes}/>
        <Stack.Screen name="Perfil" component={Perfil}/>
        <Stack.Screen name="Ajuda" component={Ajuda}/>
        <Stack.Screen name="Contato" component={Contato}/>
        <Stack.Screen name="RegistroColetaNaoReciclavel" component={RegistroColetaNaoReciclavel}/>
        <Stack.Screen name="RegistroColetaReciclavel" component={RegistroColetaReciclavel}/>
        <Stack.Screen name="RegistroColetaPapelReciclavel" component={RegistroColetaPapelReciclavel}/>
        <Stack.Screen name="Politica" component={Politica}/>
        <Stack.Screen name="Termos" component={Termos}/>
        <Stack.Screen name="GerarRelatorios" component={GerarRelatorios}/>
        <Stack.Screen name="Historico" component={Historico}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;