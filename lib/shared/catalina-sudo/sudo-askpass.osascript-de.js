#!/usr/bin/env osascript -l JavaScript

ObjC.import('stdlib')

const app = Application.currentApplication()
app.includeStandardAdditions = true

const result = app.displayDialog('balenaEtcher benötigt privilegierten Zugriff, um Datenträger flashen zu können.\n\nGib dein Passwort ein, um dies zu erlauben.', {
  defaultAnswer: '',
  withIcon: 'caution',
  buttons: ['Abbrechen', 'Ok'],
  defaultButton: 'Ok',
  hiddenAnswer: true,
})

if (result.buttonReturned === 'Ok') {
  result.textReturned
} else {
  $.exit(255)
}

