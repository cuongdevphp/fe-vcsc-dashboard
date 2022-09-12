/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import * as CKSource from '../../ckeditor/build/cksource';

import type {
	CKEditor5
} from './index';
import {
	CKEditorComponent,
	CKEditorModule
} from './index';

describe( 'index.ts - the entry file', () => {
	let component: CKEditorComponent;
	let fixture: ComponentFixture<CKEditorComponent>;

	beforeEach( async () => {
		await TestBed.configureTestingModule( {
			declarations: [ CKEditorComponent ]
		} )
			.compileComponents();

		fixture = TestBed.createComponent( CKEditorComponent );
		component = fixture.componentInstance;
		component.editor = CKSource.ClassicEditor;
	} );

	it( 'should expose the CKEditorComponent', () => {
		fixture.detectChanges();

		return wait().then( () => {
			const componentInstance: CKEditor5.Editor = component.editorInstance!;

			expect( componentInstance ).toBeTruthy();
		} );
	} );

	it( 'should expose the CKEditorModule', () => {
		expect( CKEditorModule ).toBeTruthy();
	} );
} );

function wait( time?: number ) {
	return new Promise( res => {
		setTimeout( res, time );
	} );
}
