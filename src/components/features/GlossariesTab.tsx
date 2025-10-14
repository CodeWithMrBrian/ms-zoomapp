import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MOCK_GLOSSARIES } from '../../utils/mockData';
import { Glossary } from '../../types';
import { GlossaryEditPage } from '../pages/GlossaryEditPage';
import { GlossaryImportModal } from '../modals/GlossaryImportModal';
import { GlossaryExportModal } from '../modals/GlossaryExportModal';

/**
 * GlossariesTab Component
 *
 * Manage custom glossaries for domain-specific terminology.
 *
 * Features:
 * - Glossary list with term counts
 * - Upload new glossaries (CSV)
 * - View glossary terms
 * - Edit/delete glossaries
 * - Meeting type tags
 */

type GlossariesView = 'main' | 'edit' | 'view-terms';

export function GlossariesTab() {
  const [glossaries, setGlossaries] = useState<Glossary[]>(MOCK_GLOSSARIES);
  const [currentView, setCurrentView] = useState<GlossariesView>('main');
  const [selectedGlossaryId, setSelectedGlossaryId] = useState<string | null>(null);
  const [viewingGlossary, setViewingGlossary] = useState<Glossary | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportGlossaryId, setExportGlossaryId] = useState<string | null>(null);

  // Navigate to edit page
  const handleEditGlossary = (glossaryId: string) => {
    setSelectedGlossaryId(glossaryId);
    setCurrentView('edit');
  };

  // (Removed unused handleCreateGlossary)

  // Back to main view
  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedGlossaryId(null);
    setViewingGlossary(null);
  };

  // Handle import
  const handleImport = () => {
    setShowImportModal(true);
  };

  // Handle export
  const handleExport = (glossaryId: string) => {
    setExportGlossaryId(glossaryId);
    setShowExportModal(true);
  };

  // Delete glossary
  const deleteGlossary = (glossaryId: string) => {
    if (confirm('Are you sure you want to delete this glossary?')) {
      setGlossaries(prev => prev.filter(g => g.id !== glossaryId));
    }
  };

  // Render edit page
  if (currentView === 'edit' && selectedGlossaryId) {
    return (
      <GlossaryEditPage
        glossaryId={selectedGlossaryId}
        onBack={handleBackToMain}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Upload Button */}
      {!viewingGlossary && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Custom Glossaries
          </h2>
          <Button variant="primary" onClick={handleImport}>
            + Upload New Glossary (CSV)
          </Button>
        </div>
      )}

      {/* Glossary Details View */}
      {viewingGlossary && (
        <Card variant="default" padding="lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{viewingGlossary.name}</CardTitle>
              <Button variant="secondary" size="sm" onClick={() => setViewingGlossary(null)}>
                ← Back to List
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Total Terms</p>
                  <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    {viewingGlossary.term_count}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Languages</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {viewingGlossary.languages.join(', ').toUpperCase()}
                  </p>
                </div>
              </div>

              {viewingGlossary.description && (
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {viewingGlossary.description}
                </p>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Sample Terms
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2 text-sm max-h-96 overflow-y-auto">
                  {viewingGlossary.id === 'glossary_medical_001' && (
                    <>
                      <p><strong>Hypertension</strong> → Hipertensión (ES), Hypertension (FR)</p>
                      <p><strong>Diabetes</strong> → Diabetes (ES), Diabète (FR)</p>
                      <p><strong>MRI</strong> → Resonancia magnética (ES), IRM (FR)</p>
                      <p><strong>Prescription</strong> → Receta (ES), Ordonnance (FR)</p>
                      <p className="text-gray-600 dark:text-gray-400 italic">
                        ...and {viewingGlossary.term_count - 4} more terms
                      </p>
                    </>
                  )}
                  {viewingGlossary.id === 'glossary_product_001' && (
                    <>
                      <p><strong>SyncPro</strong> → SyncPro (all languages - brand name)</p>
                      <p><strong>CloudSync</strong> → CloudSync (all languages - brand name)</p>
                      <p><strong>Dashboard</strong> → Panel de control (ES), Tableau de bord (FR)</p>
                      <p className="text-gray-600 dark:text-gray-400 italic">
                        ...and {viewingGlossary.term_count - 3} more terms
                      </p>
                    </>
                  )}
                  {viewingGlossary.id === 'glossary_legal_001' && (
                    <>
                      <p><strong>Litigation</strong> → Litigio (ES), Contentieux (FR)</p>
                      <p><strong>Plaintiff</strong> → Demandante (ES), Plaignant (FR)</p>
                      <p><strong>Defendant</strong> → Demandado (ES), Défendeur (FR)</p>
                      <p className="text-gray-600 dark:text-gray-400 italic">
                        ...and {viewingGlossary.term_count - 3} more terms
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => handleExport(viewingGlossary.id)}>
                  Export CSV
                </Button>
                <Button variant="secondary" onClick={() => handleEditGlossary(viewingGlossary.id)}>
                  Edit Terms
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Glossary List */}
      {!viewingGlossary && (
        <div className="space-y-4">
          {glossaries.length === 0 && (
            <Card variant="default" padding="lg">
              <CardContent>
                <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No glossaries yet. Upload a CSV file to create domain-specific terminology.
                </p>
              </CardContent>
            </Card>
          )}

          {glossaries.map(glossary => (
            <Card key={glossary.id} variant="hover" padding="lg">
              <div className="space-y-4">
                {/* Glossary Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {glossary.name}
                    </h3>
                    {glossary.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {glossary.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="info">
                    {glossary.term_count} terms
                  </Badge>
                </div>

                {/* Glossary Details */}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2 text-sm">
                  <p>
                    <strong>Languages:</strong> {glossary.languages.join(', ').toUpperCase()}
                  </p>
                  <p>
                    <strong>Created:</strong> {new Date(glossary.created_at).toLocaleDateString()}
                  </p>
                  {glossary.meeting_type_tags && glossary.meeting_type_tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <strong>Tagged for:</strong>
                      <div className="flex gap-2">
                        {glossary.meeting_type_tags.map(tag => (
                          <Badge key={tag} variant="success">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Glossary Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="primary" size="sm" onClick={() => setViewingGlossary(glossary)}>
                    View Terms
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handleEditGlossary(glossary.id)}>
                    Edit
                  </Button>
                  <Button variant="tertiary" size="sm" onClick={() => deleteGlossary(glossary.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      {!viewingGlossary && (
        <Card variant="default" padding="lg" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <CardContent>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              About Glossaries
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Glossaries help ensure consistent translation of domain-specific terms. Upload a CSV file with source terms and their translations in your target languages. The system will automatically use these terms during translation sessions.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <GlossaryImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        glossaryId="new"
      />

      <GlossaryExportModal
        isOpen={showExportModal}
        onClose={() => {
          setShowExportModal(false);
          setExportGlossaryId(null);
        }}
        glossaryId={exportGlossaryId || ''}
        glossaryName={glossaries.find(g => g.id === exportGlossaryId)?.name || ''}
      />
    </div>
  );
}
