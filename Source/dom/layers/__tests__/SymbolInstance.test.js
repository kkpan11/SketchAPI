/* globals expect, test */
/* eslint-disable no-param-reassign */
import { SymbolInstance } from '../..'
import { createSymbolMaster, canBeLogged } from '../../../test-utils'

test('should create a instance by setting the master property', (_context, document) => {
  const { master } = createSymbolMaster(document)
  const instance = new SymbolInstance({
    parent: document.selectedPage,
    master,
  })

  expect(instance.type).toBe('SymbolInstance')
  expect(instance.master).toEqual(master)
  expect(master.getAllInstances()).toEqual([instance])

  canBeLogged(instance, SymbolInstance)
})

test('should create a instance by setting the symbolId property', (_context, document) => {
  const { master } = createSymbolMaster(document)
  const instance = new SymbolInstance({
    symbolId: master.symbolId,
    parent: document.selectedPage,
  })
  expect(instance.type).toBe('SymbolInstance')
  expect(master.getAllInstances()).toEqual([instance])
  expect(instance.master).toEqual(master)
})

test('should have overrides', (_context, document) => {
  const { master, text } = createSymbolMaster(document)
  const instance = master.createNewInstance()
  document.selectedPage.layers = document.selectedPage.layers.concat(instance)
  instance.sketchObject.ensureDetachHasUpdated()

  expect(instance.overrides.length).toBe(7)
  const override = instance.overrides[0]
  const result = {
    type: 'Override',
    id: `${text.id}_stringValue`,
    path: text.id,
    property: 'stringValue',
    symbolOverride: false,
    value: 'Test value',
    isDefault: true,
    editable: true,
    affectedLayer: text.toJSON(),
    selected: false,
  }
  delete result.affectedLayer.selected
  result.affectedLayer.style = instance.overrides[0].affectedLayer.style.toJSON()
  expect(override.toJSON()).toEqual(result)
})

// Disabled via #49647 and #49751
// - fix #49472 didn't work after all. :sad-panda:
// We NEED these tests, so for now we should disable this one until
// we know why this isn't working correctly. - JLN, 6 Mar, 2023
// 
//test('should detach an instance', (_context, document) => {
//  const { master } = createSymbolMaster(document)
//  const instance = new SymbolInstance({
//    symbolId: master.symbolId,
//    parent: document.selectedPage,
//  })
//  instance.sketchObject.ensureDetachHasUpdated()
//  expect(instance.type).toBe('SymbolInstance')
//
//  const group = instance.detach()
//  expect(group.type).toBe('Group')
//})
//
//// Regression SketchAPI#851, #39113.
//test('should detach an instance recursively', (_context, document) => {
//  const { master } = createSymbolMaster(document)
//  const instance = new SymbolInstance({
//    symbolId: master.symbolId,
//    parent: document.selectedPage,
//  })
//  instance.sketchObject.ensureDetachHasUpdated()
//  expect(instance.type).toBe('SymbolInstance')
//
//  const group = instance.detach({ recursively: true })
//  expect(group.type).toBe('Group')
//})
//
//test('should resize in response to smart layout changes', (_context, document) => {
//  const { master } = createSymbolMaster(document)
//  master.smartLayout = SmartLayout.LeftToRight
//  const instance = new SymbolInstance({
//    symbolId: master.symbolId,
//    parent: document.selectedPage,
//  })
//  const initialWidth = instance.frame.width
//  instance.overrides[0].value = 'A string that is long enough to cause a size change, hopefully in the positive direction'
//  instance.resizeWithSmartLayout()
//  const widthAfterSmartLayout = instance.frame.width
//  expect(widthAfterSmartLayout).toBeGreaterThan(initialWidth)
//})

// test('should change an override value', (_context, document) => {
//   const { master } = createSymbolMaster(document)
//   const instance = new SymbolInstance({
//     symbolId: master.symbolId,
//     parent: document.selectedPage,
//   })
//   expect(instance.overrides[0].value).toBe('Test value')
//   instance.overrides[0].value = 'New value'
//   expect(instance.overrides[0].value).toBe('New value')
// })
