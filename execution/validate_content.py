#!/usr/bin/env python3
"""Validate the minimum content index; see CONTRACT-NOTES.md for integration gaps."""
import json, sys, datetime
from pathlib import Path

def validate(data):
    errors=[]
    def fail(message): errors.append(message)
    if not isinstance(data,dict): return ['Root must be an object']
    required={'version','signs','claims','sources','assets'}
    if set(data)!=required: fail('Root keys must be '+str(sorted(required)))
    if not isinstance(data.get('version'),str) or not data['version'].strip(): fail('Version required')
    indexes={}
    for group in ['signs','claims','sources','assets']:
        records=data.get(group)
        if not isinstance(records,list): fail(group+' must be an array'); records=[]
        indexes[group]={}
        for record in records:
            if not isinstance(record,dict): fail(group+': object required'); continue
            identifier=record.get('id')
            if not isinstance(identifier,str) or not identifier.strip(): fail(group+': nonempty id required'); continue
            if identifier in indexes[group]: fail(group+': duplicate '+identifier)
            indexes[group][identifier]=record
    names={r.get('name') for r in indexes['signs'].values() if isinstance(r.get('name'),str)}
    expected=set('Aries Taurus Gemini Cancer Leo Virgo Libra Scorpio Sagittarius Capricorn Aquarius Pisces'.split())
    if len(indexes['signs'])!=12 or names!=expected: fail('Exactly 12 canonical signs required')
    for group,fields in {'signs':['name','region','element','realm','symbolicText'],'claims':['text','reviewer','reviewedAt'],'sources':['title','locator'],'assets':['path','license','rightsEvidence']}.items():
        for identifier,record in indexes[group].items():
            for field in fields:
                if not isinstance(record.get(field),str) or not record[field].strip(): fail(identifier+': missing '+field)
    def refs(record,field,target,minimum=0):
        values=record.get(field)
        if not isinstance(values,list) or len(values)<minimum or any(not isinstance(v,str) for v in values): fail(str(record.get('id'))+': invalid '+field); return
        if target:
            for value in values:
                if value not in indexes[target]: fail(str(record.get('id'))+': unresolved '+value)
    for r in indexes['signs'].values():
        if r.get('element') not in ['fire','earth','air','water']: fail(r['id']+': invalid element')
        if r.get('realm') not in ['Land','Sky','Water','Hybrid']: fail(r['id']+': invalid realm')
        refs(r,'foodIds',None); refs(r,'claimIds','claims')
    for r in indexes['claims'].values():
        refs(r,'sourceIds','sources',1)
        if r.get('status')!='approved': fail(r['id']+': claim not approved')
        try: datetime.date.fromisoformat(r.get('reviewedAt',''))
        except (ValueError,TypeError): fail(r['id']+': invalid review date')
    for r in indexes['assets'].values():
        if r.get('approved') is not True: fail(r['id']+': rights not approved')
    return errors

if __name__=='__main__':
    if len(sys.argv)!=2: sys.exit('Usage: python3 execution/validate_content.py CONTENT.json')
    try: result=validate(json.loads(Path(sys.argv[1]).read_text()))
    except (OSError,json.JSONDecodeError) as exc: sys.exit(str(exc))
    if result:
        print('\n'.join(result)); sys.exit(1)
    print('Minimum content-index checks passed. Full integration checks still required.')
