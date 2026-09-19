import test from 'node:test';
import assert from 'node:assert/strict';
import {alumni,filterAlumni,states} from '../src/data/alumni.js';
test('demo data has unique alumni across the required states',()=>{assert.ok(alumni.length>=40);assert.equal(new Set(alumni.map(a=>a.id)).size,alumni.length);assert.equal(states.length,9);assert.ok(alumni.every(a=>Number.isFinite(a.lat)&&Number.isFinite(a.lng)))});
test('combined filters narrow search, role, state and batch',()=>{const a=alumni[0];const found=filterAlumni(alumni,{search:'RAJESH',role:a.role,state:a.state,batch:a.batch});assert.deepEqual(found.map(a=>a.id),[a.id]);assert.equal(filterAlumni(alumni,{search:'does-not-exist'}).length,0)});
test('online and verification filters preserve boolean false',()=>{assert.ok(filterAlumni(alumni,{online:true}).every(a=>a.online));assert.ok(filterAlumni(alumni,{verified:'false'}).every(a=>!a.verified))});
