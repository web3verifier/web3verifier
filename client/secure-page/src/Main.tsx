import React from 'react';
import { Router } from '../src/Router';
import { createRoot } from 'react-dom/client'

const container = document.getElementById('root')
const root = createRoot( container! )
root.render( <Router /> )