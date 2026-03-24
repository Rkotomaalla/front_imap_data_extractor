import DirectoryService from "@/api/services/DirectoryService";
import { BotAction, Directory, FormAction } from "@/types/entity";
import { FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Select, Spin } from 'antd';
import { AutoComplete } from "antd";
import { TreeNode } from "antd/es/tree-select";
import { Alert, TreeSelect } from "antd/lib";
import { forEach } from "ramda";
import { useEffect, useState } from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";


// ==================================================================================
// Fonction récursive pour construire les TreeNode
const renderTreeNodes = (directories: Directory[]): React.ReactNode => {
  return directories.map((dir) => (
    <TreeNode
      key={dir.dir_id}
      value={dir.dir_id}
      title={dir.dir_label}
    >
      {dir.children && dir.children.length > 0 ? renderTreeNodes(dir.children) : null}
    </TreeNode>
  ));
};

type InputProps =  {
  form: UseFormReturn<FormAction>
}
// ─── Helper (unchanged, works correctly) ─────────────────────────────────────
const setChild = async (directory: Directory): Promise<Directory> => {
  try {
    const childrenResponse = await DirectoryService.getChildDirList(directory.dir_id);
    if (!childrenResponse.results || childrenResponse.results.length === 0) {
      return { ...directory, children: [] };
    }
    const resolvedChildren = await Promise.all(
      childrenResponse.results.map((child) => setChild(child))
    );
    return { ...directory, children: resolvedChildren };
  } catch (error) {
    console.error(`Erreur lors du chargement des enfants pour ${directory.dir_label}:`, error);
    return { ...directory, children: [] };
  }
};

// ─── Level state type ─────────────────────────────────────────────────────────
type SelectLevel = {
  directories: Directory[];
  selectedDir: Directory | null;
};

export function MoveAttachmentInput({ form }: InputProps) {
  const [selectLevels, setSelectLevels] = useState<SelectLevel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Charge les répertoires racine au montage
  useEffect(() => {
    const loadMainDir = async () => {
      try {
        setIsLoading(true);
        const mainDirList = await DirectoryService.getMainDirList();

        if (mainDirList.results && mainDirList.results.length > 0) {
          const directoriesWithChildren = await Promise.all(
            mainDirList.results.map((dir) => setChild(dir))
          );
          setSelectLevels([{ directories: directoriesWithChildren, selectedDir: null }]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des répertoires racine:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMainDir();
  }, []);

  // ── FIX 1 : buildPath opère sur les nouveaux niveaux passés en argument ──────
  const buildPath = (levels: SelectLevel[]): string => {
    return levels
      .map((level) => level.selectedDir?.dir_label)
      .filter(Boolean)
      .join("/");
  };

  // Gère la sélection d'un répertoire à un niveau donné
  const handleDirectorySelect = (levelIndex: number, dirId: number | undefined) => {
    if (dirId === undefined) return;

    const selectedDir = selectLevels[levelIndex].directories.find(
      (dir) => dir.dir_id === dirId
    );
    if (!selectedDir) return;

    // ── FIX 2 : on tronque d'abord les niveaux suivants, puis on met à jour ──
    const truncated: SelectLevel[] = selectLevels.slice(0, levelIndex + 1).map(
      (level, i) =>
        i === levelIndex
          ? { ...level, selectedDir }
          : level
    );

    // Ajoute un niveau enfant si le dossier sélectionné en possède
    const newLevels: SelectLevel[] =
      selectedDir.children && selectedDir.children.length > 0
        ? [...truncated, { directories: selectedDir.children, selectedDir: null }]
        : truncated;

    setSelectLevels(newLevels);

    // ── FIX 3 : buildPath utilise newLevels, pas l'ancien state ──────────────
    const path = buildPath(newLevels);
    form.setValue("value", path);
    form.clearErrors("value");
  };

  // ── FIX 4 : handleBack réinitialise la sélection du niveau cible ─────────
  const handleBack = (levelIndex: number) => {
    // On garde les niveaux 0..levelIndex-1 intacts,
    // et on réinitialise la sélection du niveau levelIndex-1
    const newLevels: SelectLevel[] = selectLevels
      .slice(0, levelIndex)
      .map((level, i) =>
        i === levelIndex - 1
          ? { ...level, selectedDir: null }  // ← réinitialise le parent
          : level
      );

    setSelectLevels(newLevels);

    const path = buildPath(newLevels);
    form.setValue("value", path);
  };

  return (
    <div>
      {isLoading ? (
        <div>Chargement des répertoires...</div>
      ) : (
        <>
          {selectLevels.map((level, index) => (
            <div key={index} style={{ marginBottom: "8px" }}>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleBack(index)}
                  style={{ marginRight: "8px" }}
                >
                  ← Retour
                </button>
              )}

              <Select
                placeholder={
                  index === 0
                    ? "Sélectionnez un répertoire racine"
                    : `Sélectionnez un sous-répertoire (niveau ${index + 1})`
                }
                onChange={(value) => handleDirectorySelect(index, value)}
                style={{ width: "100%" }}
                value={level.selectedDir?.dir_id ?? undefined}
              >
                {level.directories.map((dir) => (
                  <Select.Option key={dir.dir_id} value={dir.dir_id}>
                    {dir.dir_label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          ))}

          <div style={{ marginTop: "16px" }}>
            <p>Chemin sélectionné : {form.watch("value") || "Aucun"}</p>
            {form.formState.errors.value && (
              <Alert
                message={form.formState.errors.value.message}
                type="error"
                showIcon
                style={{ marginTop: "8px" }}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}



export function ChangeAttachementInput({form}:InputProps){
  const attachementTypeList = [
    "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv",
    "jpg", "jpeg", "png", "gif", "svg", "mp3", "wav", "mp4", "avi",
    "mov", "zip", "rar", "7z", "json", "xml", "html", "css", "js",
    "ts", "md", "epub", "odt", "ods", "odp"
  ];
  return (
    <FormField
      control={form.control}
      name="value"
      rules={{
        required: "Veuillez saisir une valeur",
      }}
      render={({ field }) => {
        // Vérifie si la valeur actuelle n'est pas dans la liste des suggestions
        const isInvalid = field.value && !attachementTypeList.includes(field.value);

        return (
          <FormItem className="grid grid-cols-4 items-center gap-4">
            <FormLabel className="text-right">Valeur de la piece jointe</FormLabel>
            <div className="col-span-3">
              <FormControl>
                <AutoComplete
                  options={attachementTypeList.map((type) => ({
                    value: type,
                    label: type,
                  }))}
                  value={field.value}
                  onChange={field.onChange}  // ✅ Utilise field.onChange pour mettre à jour la valeur
                  placeholder="Rechercher un type de pièce jointe..."
                  filterOption={(inputValue, option) =>
                    option?.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
                  }
                  style={{
                    width: "100%",
                    borderColor: isInvalid ? "#ff4d4f" : undefined,  // Rouge si invalide
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                />
              </FormControl>
              {isInvalid && (
                <p className="text-red-500 text-xs mt-1">
                  Ce type de pièce jointe n'est pas reconnu.
                </p>
              )}
            </div>
          </FormItem>
        );
      }}
    />
  );
};
// ====================================================================
const CLASSIFY_GROUPS = [
  {
    group: "Catégorie",
    options: [
      { value: "invoice",   label: "Facture",          sub: "Comptabilité",   icon: "🧾", color: "#f59e0b" },
      { value: "contract",  label: "Contrat",          sub: "Juridique",      icon: "📋", color: "#6366f1" },
      { value: "complaint", label: "Réclamation",      sub: "Client",         icon: "⚠️",  color: "#ef4444" },
      { value: "quote",     label: "Devis",            sub: "Commercial",     icon: "💼", color: "#10b981" },
      { value: "hr",        label: "RH",               sub: "Recrutement",    icon: "👤", color: "#8b5cf6" },
      { value: "support",   label: "Support",          sub: "Technique",      icon: "🔧", color: "#0ea5e9" },
    ],
  },
  {
    group: "Statut",
    options: [
      { value: "todo",      label: "À traiter",        sub: "Action requise", icon: "🔴", color: "#ef4444" },
      { value: "waiting",   label: "En attente",       sub: "Réponse",        icon: "🟡", color: "#f59e0b" },
      { value: "done",      label: "Traité",           sub: "Archivé",        icon: "🟢", color: "#10b981" },
      { value: "delegate",  label: "À déléguer",       sub: "Transfert",      icon: "↗️",  color: "#6366f1" },
    ],
  },
  {
    group: "Nature",
    options: [
      { value: "client",    label: "Client",           sub: "Externe",        icon: "🏢", color: "#0ea5e9" },
      { value: "supplier",  label: "Fournisseur",      sub: "Externe",        icon: "📦", color: "#f59e0b" },
      { value: "internal",  label: "Interne",          sub: "Équipe",         icon: "🏠", color: "#8b5cf6" },
      { value: "spam",      label: "Spam",             sub: "Indésirable",    icon: "🚫", color: "#6b7280" },
    ],
  },
];

export function ClassifyEmailInput({ form }: InputProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const handleSelect = (value: string, label: string) => {
    if (selected === value) {
      // Deselect
      setSelected(null);
      form.setValue("value", "");
    } else {
      setSelected(value);
      form.setValue("value", value);
      form.clearErrors("value");
    }
  };

  const allOptions = CLASSIFY_GROUPS.flatMap((g) => g.options);
  const selectedOption = allOptions.find((o) => o.value === selected);

  const filteredGroups = search
    ? [
        {
          group: "Résultats",
          options: allOptions.filter(
            (o) =>
              o.label.toLowerCase().includes(search.toLowerCase()) ||
              o.sub.toLowerCase().includes(search.toLowerCase())
          ),
        },
      ]
    : CLASSIFY_GROUPS;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        .cei-root {
          --bg: #fafaf9;
          --surface: #ffffff;
          --border: #e5e7eb;
          --border-hover: #d1d5db;
          --text-primary: #111827;
          --text-muted: #9ca3af;
          --text-sub: #6b7280;
          --radius: 12px;
          --shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
          --shadow-md: 0 4px 16px rgba(0,0,0,0.1);
          font-family: 'Outfit', sans-serif;
          color: var(--text-primary);
        }

        .cei-root * { box-sizing: border-box; }

        /* Search */
        .cei-search-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: var(--radius);
          margin-bottom: 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .cei-search-wrap:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .cei-search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          font-family: 'Outfit', sans-serif;
          color: var(--text-primary);
          background: transparent;
        }
        .cei-search-input::placeholder { color: var(--text-muted); }

        /* Scroll container */
        .cei-scroll {
          max-height: 340px;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 4px;
          scrollbar-width: thin;
          scrollbar-color: #e5e7eb transparent;
        }
        .cei-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .cei-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .cei-scroll::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 99px;
        }
        .cei-scroll::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }

        /* Group */
        .cei-group-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 8px;
          margin-top: 16px;
          padding-left: 2px;
        }
        .cei-group-label:first-child { margin-top: 0; }

        /* Grid */
        .cei-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 4px;
        }

        /* Card */
        .cei-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          padding: 12px;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: var(--radius);
          cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s, background 0.15s;
          text-align: left;
          outline: none;
        }
        .cei-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
        }
        .cei-card.selected {
          border-color: var(--card-color);
          background: color-mix(in srgb, var(--card-color) 8%, white);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--card-color) 18%, transparent);
        }
        .cei-card-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.2;
        }
        .cei-card-sub {
          font-size: 11px;
          color: var(--text-sub);
          font-weight: 400;
        }
        .cei-card-check {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--card-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          color: #fff;
          opacity: 0;
          transform: scale(0.5);
          transition: opacity 0.15s, transform 0.15s;
        }
        .cei-card.selected .cei-card-check {
          opacity: 1;
          transform: scale(1);
        }

        /* Result display */
        .cei-result {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 16px;
          padding: 12px 16px;
          border-radius: var(--radius);
          border: 1.5px solid var(--border);
          background: var(--surface);
          animation: slideUp 0.2s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cei-result-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .cei-result-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          margin-bottom: 1px;
        }
        .cei-result-value {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: var(--text-primary);
          font-weight: 700;
        }
        .cei-result-clear {
          margin-left: auto;
          font-size: 11px;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: transparent;
          font-family: 'Outfit', sans-serif;
          transition: background 0.15s, color 0.15s;
        }
        .cei-result-clear:hover {
          background: #fee2e2;
          color: #ef4444;
          border-color: #fca5a5;
        }

        /* Empty */
        .cei-empty {
          text-align: center;
          padding: 32px 16px;
          color: var(--text-muted);
          font-size: 14px;
        }
      `}</style>

      <div className="cei-root">
        {/* Search */}
        <div className="cei-search-wrap">
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>⌕</span>
          <input
            className="cei-search-input"
            placeholder="Rechercher une classification…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <span
              style={{ cursor: "pointer", color: "var(--text-muted)", fontSize: "13px" }}
              onClick={() => setSearch("")}
            >
              ✕
            </span>
          )}
        </div>

        {/* Groups */}
        <div className="cei-scroll">
        {filteredGroups.every((g) => g.options.length === 0) ? (
          <div className="cei-empty">
            Aucun résultat pour « {search} »
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div key={group.group}>
              <div className="cei-group-label">{group.group}</div>
              <div className="cei-grid">
                {group.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`cei-card${selected === option.value ? " selected" : ""}`}
                    style={{ "--card-color": option.color } as React.CSSProperties}
                    onClick={() => handleSelect(option.value, option.label)}
                  >
                    <div className="cei-card-check">✓</div>
                    <div className="cei-card-label">{option.label}</div>
                    <div className="cei-card-sub">{option.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
        </div>

        {/* Selected result */}
        {selectedOption && (
          <div className="cei-result">
            <div
              className="cei-result-dot"
              style={{ background: selectedOption.color }}
            />
            <div>
              <div className="cei-result-label">Classification</div>
              <div className="cei-result-value">
                {selectedOption.label} — {selectedOption.sub}
              </div>
            </div>
            <button
              type="button"
              className="cei-result-clear"
              onClick={() => {
                setSelected(null);
                form.setValue("value", "");
              }}
            >
              Effacer
            </button>
          </div>
        )}
      </div>
    </>
  );
}



export function InputActionValue({ form }: InputProps) {
  const action_id = form.watch("action_id");

  useEffect(() => {
    form.setValue("value", "");
  }, [action_id]);

  switch (action_id) {
    case 1:
      return <ChangeAttachementInput form={form} />;
    case 3:
      return <MoveAttachmentInput form={form} />;
    case 4:
      return <ClassifyEmailInput form={form} />;
    default:
      return null;
  }
}