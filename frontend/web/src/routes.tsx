import { Router, BrowserRouter, Route } from 'react-router-dom';
import React from "react";
import Home from './pages/home/Home';
import CreatePoint from './pages/CreatePoint/CreatePoint';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path='/' exact/>
            <Route component={CreatePoint} path='/create-point' />
        </BrowserRouter>
    );
}

export default Routes;