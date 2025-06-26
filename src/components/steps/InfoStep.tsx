'use client'

import React from 'react'

interface StepProps {
  formData: any;
  updateFormData: (path: string, value: any) => void;
  getNestedValue: (obj: any, path: string) => any;
}

export default function InfoStep({ formData, updateFormData, getNestedValue }: StepProps) {
  const handleInputChange = (path: string, value: any) => {
    updateFormData(path, value);
  };

  return (
    <>
      <h2 className="step-title">Algemene Informatie</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label className="form-label block text-sm font-medium text-gray-700 mb-2">Volledige naam *</label>
          <input 
            type="text" 
            className="form-input" 
            value={getNestedValue(formData, 'algemeneInfo.naam')} 
            onChange={(e) => handleInputChange('algemeneInfo.naam', e.target.value)}
            placeholder="Jouw volledige naam"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label block text-sm font-medium text-gray-700 mb-2">Studiejaar *</label>
          <select 
            className="form-select" 
            value={getNestedValue(formData, 'algemeneInfo.studiejaar')}
            onChange={(e) => handleInputChange('algemeneInfo.studiejaar', e.target.value)}
          >
            <option value="">Selecteer studiejaar</option>
            <option value="1">1e jaar</option>
            <option value="2">2e jaar</option>
            <option value="3">3e jaar</option>
            <option value="4">4e jaar</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label block text-sm font-medium text-gray-700 mb-2">Vak/Module *</label>
          <input 
            type="text" 
            className="form-input" 
            value={getNestedValue(formData, 'algemeneInfo.vak')} 
            onChange={(e) => handleInputChange('algemeneInfo.vak', e.target.value)}
            placeholder="Bijv. Event Management, Tourism Marketing"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label block text-sm font-medium text-gray-700 mb-2">Periode</label>
          <select 
            className="form-select" 
            value={getNestedValue(formData, 'algemeneInfo.periode')}
            onChange={(e) => handleInputChange('algemeneInfo.periode', e.target.value)}
          >
            <option value="">Selecteer periode</option>
            <option value="1">Periode 1</option>
            <option value="2">Periode 2</option>
            <option value="3">Periode 3</option>
            <option value="4">Periode 4</option>
          </select>
        </div>
      </div>
    </>
  )
}