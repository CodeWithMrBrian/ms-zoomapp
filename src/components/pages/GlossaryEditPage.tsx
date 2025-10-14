import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Breadcrumbs, BreadcrumbItem } from '../ui/Breadcrumbs';
import { useToast, Toast } from '../ui/Toast';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { MOCK_GLOSSARIES } from '../../utils/mockData';

export interface GlossaryEditPageProps {
// ...existing code...
  onBack: () => void;
}

interface GlossaryTerm {
  id: string;
  sourceTerm: string;
  targetLanguage: string;
  translation: string;
  notes: string;
}

// Mock terms data for the first glossary
const MOCK_TERMS: GlossaryTerm[] = [
  { id: 'term_001', sourceTerm: 'MRI', targetLanguage: 'es', translation: 'Resonancia Magnética', notes: 'Medical imaging technique' },
  { id: 'term_002', sourceTerm: 'CT Scan', targetLanguage: 'es', translation: 'Tomografía Computarizada', notes: 'Computed tomography' },
  { id: 'term_003', sourceTerm: 'Diagnosis', targetLanguage: 'es', translation: 'Diagnóstico', notes: 'Medical determination' },
  { id: 'term_004', sourceTerm: 'Prescription', targetLanguage: 'es', translation: 'Receta', notes: 'Written medication order' },
  { id: 'term_005', sourceTerm: 'Anesthesia', targetLanguage: 'fr', translation: 'Anesthésie', notes: 'Loss of sensation' },
  { id: 'term_006', sourceTerm: 'Surgery', targetLanguage: 'fr', translation: 'Chirurgie', notes: 'Operative procedure' },
  { id: 'term_007', sourceTerm: 'Vital Signs', targetLanguage: 'de', translation: 'Vitalzeichen', notes: 'Basic health measurements' },
  { id: 'term_008', sourceTerm: 'Blood Pressure', targetLanguage: 'de', translation: 'Blutdruck', notes: 'Arterial pressure' }
];

/**
 * GlossaryEditPage Component
 *
 * Allows editing glossary details and managing terms with inline editing.
 */
export function GlossaryEditPage({ onBack }: GlossaryEditPageProps) {
  const { toast, showToast } = useToast();
  const glossary = MOCK_GLOSSARIES[0]; // Using first glossary as editable

  const [glossaryName, setGlossaryName] = useState(glossary.name);
  const [glossaryDescription, setGlossaryDescription] = useState('Medical terminology for healthcare professionals');
  const [terms, setTerms] = useState<GlossaryTerm[]>(MOCK_TERMS);
// ...existing code...
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerms, setSelectedTerms] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [termToDelete, setTermToDelete] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTerm, setNewTerm] = useState<Omit<GlossaryTerm, 'id'>>({
    sourceTerm: '',
    targetLanguage: 'es',
    translation: '',
    notes: ''
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', onClick: onBack },
    { label: 'Glossaries', onClick: onBack },
    { label: 'Edit Glossary' }
  ];

  // Filter terms by search query
  const filteredTerms = terms.filter(term =>
    term.sourceTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.targetLanguage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveChanges = () => {
    showToast('Glossary changes saved successfully', 'success');
  };

  const handleDeleteTerm = (termId: string) => {
    setTermToDelete(termId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteTerm = () => {
    if (termToDelete) {
      setTerms(terms.filter(t => t.id !== termToDelete));
      showToast('Term deleted', 'success');
      setShowDeleteConfirm(false);
      setTermToDelete(null);
    }
  };

  const handleAddNewTerm = () => {
    if (!newTerm.sourceTerm || !newTerm.translation) {
      showToast('Source term and translation are required', 'error');
      return;
    }

    const term: GlossaryTerm = {
      id: `term_${Date.now()}`,
      ...newTerm
    };
    setTerms([...terms, term]);
    setIsAddingNew(false);
    setNewTerm({ sourceTerm: '', targetLanguage: 'es', translation: '', notes: '' });
    showToast('Term added successfully', 'success');
  };

  const handleToggleSelect = (termId: string) => {
    const newSelected = new Set(selectedTerms);
    if (newSelected.has(termId)) {
      newSelected.delete(termId);
    } else {
      newSelected.add(termId);
    }
    setSelectedTerms(newSelected);
  };

  const handleDeleteSelected = () => {
    if (selectedTerms.size === 0) {
      showToast('No terms selected', 'warning');
      return;
    }
    setTerms(terms.filter(t => !selectedTerms.has(t.id)));
    setSelectedTerms(new Set());
    showToast(`${selectedTerms.size} terms deleted`, 'success');
  };

  const handleExportSelected = () => {
    if (selectedTerms.size === 0) {
      showToast('No terms selected', 'warning');
      return;
    }
    showToast(`Exporting ${selectedTerms.size} terms...`, 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="tertiary" onClick={onBack} className="gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Glossaries
            </Button>
          </div>

          <Breadcrumbs items={breadcrumbItems} className="mb-4" />

          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Edit Glossary</h1>
        </div>

        {/* Glossary Details Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Glossary Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Glossary Name"
                value={glossaryName}
                onChange={(e) => setGlossaryName(e.target.value)}
                placeholder="Enter glossary name"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={glossaryDescription}
                  onChange={(e) => setGlossaryDescription(e.target.value)}
                  placeholder="Enter glossary description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Terms ({terms.length})</CardTitle>
              <Button onClick={() => setIsAddingNew(true)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Term
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Bulk Actions */}
            <div className="mb-4 flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search terms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {selectedTerms.size > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExportSelected}>
                    Export Selected ({selectedTerms.size})
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
                    Delete Selected ({selectedTerms.size})
                  </Button>
                </div>
              )}
            </div>

            {/* Terms Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 w-12">
                      <input
                        type="checkbox"
                        checked={selectedTerms.size === filteredTerms.length && filteredTerms.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTerms(new Set(filteredTerms.map(t => t.id)));
                          } else {
                            setSelectedTerms(new Set());
                          }
                        }}
                        className="rounded"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Source Term
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Target Language
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Translation
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Notes
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Add New Term Row */}
                  {isAddingNew && (
                    <tr className="border-b border-gray-100 dark:border-gray-800 bg-teal-50 dark:bg-teal-900/20">
                      <td className="py-3 px-4"></td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={newTerm.sourceTerm}
                          onChange={(e) => setNewTerm({ ...newTerm, sourceTerm: e.target.value })}
                          placeholder="Enter term"
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={newTerm.targetLanguage}
                          onChange={(e) => setNewTerm({ ...newTerm, targetLanguage: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                        >
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="zh">Chinese</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={newTerm.translation}
                          onChange={(e) => setNewTerm({ ...newTerm, translation: e.target.value })}
                          placeholder="Enter translation"
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={newTerm.notes}
                          onChange={(e) => setNewTerm({ ...newTerm, notes: e.target.value })}
                          placeholder="Optional notes"
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" onClick={handleAddNewTerm}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setIsAddingNew(false)}>Cancel</Button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Existing Terms */}
                  {filteredTerms.map((term) => (
                    <tr key={term.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedTerms.has(term.id)}
                          onChange={() => handleToggleSelect(term.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                        {term.sourceTerm}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="neutral" size="sm">
                          {term.targetLanguage.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                        {term.translation}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {term.notes}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteTerm(term.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTerms.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No terms found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3 justify-end">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteTerm}
        title="Delete Term?"
        message="Are you sure you want to delete this term? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      {/* Toast */}
      <Toast {...toast} />
    </div>
  );
}
