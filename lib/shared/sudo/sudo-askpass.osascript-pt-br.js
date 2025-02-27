#!/usr/bin/env osascript -l JavaScript

ObjC.import('stdlib')

const app = Application.currentApplication()
app.includeStandardAdditions = true

const result = app.displayDialog('balenaEtcher precisa de acesso privilegiado para fazer flash em discos.\n\nEscreva sua senha para permitir.', {
  defaultAnswer: '',
  withIcon: 'caution',
  buttons: ['Cancelar', 'Ok'],
  defaultButton: 'Ok',
  hiddenAnswer: true,
})

if (result.buttonReturned === 'Ok') {
  result.textReturned
} else {
  $.exit(255)
}

