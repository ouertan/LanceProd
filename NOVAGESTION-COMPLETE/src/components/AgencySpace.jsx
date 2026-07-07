import React, { useState, useCallback, useEffect } from 'react';
import { ShieldCheck, Search, KeyRound, Plus, Trash2 } from 'lucide-react';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';
import StatusPill from './StatusPill';
import { safeGet, safeSet } from '../utils/storage';

const AGENCY_PASSWORD = 'agence2026';

const inputStyle = {
  fontFamily: Fonts.body,
  fontSize: 14,
  padding: '12px 14px',
  borderRadius: 8,
  border: '1px solid #D7E2EE',
  outline: 'none',
  color: Colors.navy,
  width: '100%',
};

function AgencySpace() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [index, setIndex] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [leads, setLeads] = useState([]);
  const [newClient, setNewClient] = useState({ code: '', name: '', type: 'ecommerce', password: '' });
  const [newEntry, setNewEntry] = useState({ label: '', date: '', status: 'cours', total: '' });

  const refresh = useCallback(async () => {
    setIndex((await safeGet('client-index')) || []);
    setLeads(((await safeGet('leads')) || []).slice().reverse());
  }, []);

  useEffect(() => { if (authed) refresh(); }, [authed, refresh]);

  const openClient = async (code) => {
    const rec = await safeGet(`client-record:${code}`);
    setSelected(rec);
  };

  const addClient = async (e) => {
    e.preventDefault();
    if (!newClient.code || !newClient.name) return;
    const code = newClient.code.trim().toUpperCase();
    const idx = [...index, { code, name: newClient.name, type: newClient.type }];
    await safeSet('client-index', idx);
    await safeSet(`client-record:${code}`, {
      profile: { code, name: newClient.name, type: newClient.type, password: newClient.password || '1234' },
      orders: [],
      collabs: [],
    });
    setNewClient({ code: '', name: '', type: 'ecommerce', password: '' });
    refresh();
  };

  const addEntry = async (e) => {
    e.preventDefault();
    if (!selected || !newEntry.label) return;
    const isShop = selected.profile.type === 'ecommerce';
    const key = isShop ? 'orders' : 'collabs';
    const updated = { ...selected, [key]: [...selected[key], { id: Date.now().toString(), ...newEntry }] };
    await safeSet(`client-record:${selected.profile.code}`, updated);
    setSelected(updated);
    setNewEntry({ label: '', date: '', status: isShop ? 'cours' : 'attente', total: '' });
  };

  const removeEntry = async (id) => {
    const isShop = selected.profile.type === 'ecommerce';
    const key = isShop ? 'orders' : 'collabs';
    const updated = { ...selected, [key]: selected[key].filter((x) => x.id !== id) };
    await safeSet(`client-record:${selected.profile.code}`, updated);
    setSelected(updated);
  };

  const filteredIndex = index.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  if (!authed) {
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
      }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const clean = pwd.trim().toLowerCase();
            if (clean === AGENCY_PASSWORD.toLowerCase()) {
              setAuthed(true);
              setPwdError('');
            } else setPwdError('Mot de passe incorrect. Vérifiez les espaces ou la casse.');
          }}
          style={{
            background: 'white',
            border: '1px solid #E1E9F2',
            borderRadius: 14,
            padding: 36,
            width: 360
          }}
        >
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: Colors.ice,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18,
            color: Colors.blueMid
          }}>
            <ShieldCheck size={20} />
          </div>
          <h2 style={{
            fontFamily: Fonts.display,
            fontWeight: 700,
            fontSize: 20,
            color: Colors.navy,
            margin: '0 0 8px'
          }}>
            Espace agence
          </h2>
          <p style={{
            fontFamily: Fonts.body,
            fontSize: 12.5,
            color: Colors.ink,
            marginBottom: 16
          }}>
            Accès de démonstration — mot de passe : <b>{AGENCY_PASSWORD}</b>
          </p>
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <input
              type={showPwd ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              style={{ ...inputStyle, paddingRight: 70 }}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              style={{
                position: 'absolute',
                right: 8,
                top: 8,
                background: 'none',
                border: 'none',
                color: Colors.blueMid,
                fontSize: 11.5,
                fontFamily: Fonts.body,
                fontWeight: 600
              }}
            >
              {showPwd ? 'Masquer' : 'Afficher'}
            </button>
          </div>
          {pwdError && <div style={{
            color: Colors.red,
            fontSize: 12,
            marginBottom: 8,
            fontFamily: Fonts.body
          }}>
            {pwdError}
          </div>}
          <button type="submit" className="btn-anim" style={{
            width: '100%',
            background: Colors.navy,
            color: 'white',
            fontWeight: 700,
            fontSize: 14,
            padding: '12px 20px',
            borderRadius: 9,
            border: 'none'
          }}>
            Entrer
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="agency-grid" style={{
      maxWidth: 1000,
      margin: '0 auto',
      padding: '36px 24px',
      display: 'grid',
      gap: 24
    }}>
      <div>
        <h3 style={{
          fontFamily: Fonts.display,
          fontWeight: 700,
          fontSize: 15,
          color: Colors.navy,
          marginBottom: 12
        }}>
          Clients ({filteredIndex.length})
        </h3>

        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: 12, color: Colors.ink }} />
          <input
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 30, fontSize: 12.5 }}
          />
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          marginBottom: 20,
          maxHeight: 240,
          overflowY: 'auto'
        }}>
          {filteredIndex.map((c) => (
            <button
              key={c.code}
              onClick={() => openClient(c.code)}
              className="btn-anim"
              style={{
                textAlign: 'left',
                background: selected?.profile.code === c.code ? Colors.ice : 'white',
                border: '1px solid #E1E9F2',
                borderRadius: 8,
                padding: '10px 12px'
              }}
            >
              <div style={{
                fontWeight: 600,
                fontSize: 13,
                color: Colors.navy,
                fontFamily: Fonts.body
              }}>
                {c.name}
              </div>
              <div style={{
                fontSize: 11,
                color: Colors.ink,
                fontFamily: Fonts.mono
              }}>
                {c.code}
              </div>
            </button>
          ))}
          {filteredIndex.length === 0 && (
            <div style={{
              fontSize: 12,
              color: Colors.ink,
              fontFamily: Fonts.body
            }}>
              Aucun résultat.
            </div>
          )}
        </div>

        <h4 style={{
          fontFamily: Fonts.display,
          fontWeight: 700,
          fontSize: 13,
          color: Colors.navy,
          marginBottom: 8
        }}>
          Ajouter un client
        </h4>
        <form onSubmit={addClient} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}>
          <input placeholder="Code (ex: CL-001)" value={newClient.code} onChange={(e) => setNewClient({ ...newClient, code: e.target.value })} style={{
            ...inputStyle,
            fontSize: 12.5
          }} />
          <input placeholder="Nom du client" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} style={{
            ...inputStyle,
            fontSize: 12.5
          }} />
          <div style={{ position: 'relative' }}>
            <KeyRound size={13} style={{
              position: 'absolute',
              left: 10,
              top: 11,
              color: Colors.ink
            }} />
            <input placeholder="Mot de passe (défaut: 1234)" value={newClient.password} onChange={(e) => setNewClient({ ...newClient, password: e.target.value })} style={{
              ...inputStyle,
              fontSize: 12.5,
              paddingLeft: 30
            }} />
          </div>
          <select value={newClient.type} onChange={(e) => setNewClient({ ...newClient, type: e.target.value })} style={{
            ...inputStyle,
            fontSize: 12.5
          }}>
            <option value="ecommerce">E-commerce</option>
            <option value="personnalite">Personnalité</option>
          </select>
          <button type="submit" className="btn-anim" style={{
            background: Colors.blueMid,
            color: 'white',
            fontWeight: 600,
            fontSize: 12.5,
            padding: '9px',
            borderRadius: 7,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6
          }}>
            <Plus size={14} /> Créer
          </button>
        </form>

        <h4 style={{
          fontFamily: Fonts.display,
          fontWeight: 700,
          fontSize: 13,
          color: Colors.navy,
          margin: '22px 0 8px'
        }}>
          Demandes reçues ({leads.length})
        </h4>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          maxHeight: 240,
          overflowY: 'auto'
        }}>
          {leads.map((l) => (
            <div key={l.id} style={{
              border: '1px solid #E1E9F2',
              borderRadius: 8,
              padding: '8px 10px',
              fontFamily: Fonts.body
            }}>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: Colors.navy
              }}>
                {l.name}
              </div>
              <div style={{
                fontSize: 11,
                color: Colors.ink
              }}>
                {l.contact}
              </div>
              <div style={{
                fontSize: 11,
                color: Colors.ink,
                marginTop: 2
              }}>
                {l.message}
              </div>
            </div>
          ))}
          {leads.length === 0 && (
            <div style={{
              fontSize: 12,
              color: Colors.ink,
              fontFamily: Fonts.body
            }}>
              Aucune demande reçue.
            </div>
          )}
        </div>
      </div>

      <div>
        {!selected ? (
          <div style={{
            fontFamily: Fonts.body,
            color: Colors.ink,
            fontSize: 14
          }}>
            Sélectionnez un client à gauche pour gérer son suivi.
          </div>
        ) : (
          <div>
            <h3 style={{
              fontFamily: Fonts.display,
              fontWeight: 700,
              fontSize: 18,
              color: Colors.navy,
              marginBottom: 4
            }}>
              {selected.profile.name}
            </h3>
            <div style={{
              fontFamily: Fonts.mono,
              fontSize: 11,
              color: Colors.ink,
              marginBottom: 18
            }}>
              Code : {selected.profile.code} · {selected.profile.type === 'ecommerce' ? 'E-commerce' : 'Personnalité'} · Mot de passe : {selected.profile.password}
            </div>

            <div style={{
              background: 'white',
              border: '1px solid #E1E9F2',
              borderRadius: 12,
              padding: 18,
              marginBottom: 20
            }}>
              {(selected.profile.type === 'ecommerce' ? selected.orders : selected.collabs).map((item) => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 2px',
                  borderBottom: '1px solid #F1F5FA'
                }}>
                  <div>
                    <div style={{
                      fontFamily: Fonts.body,
                      fontWeight: 600,
                      fontSize: 13,
                      color: Colors.navy
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      fontFamily: Fonts.mono,
                      fontSize: 10.5,
                      color: Colors.ink
                    }}>
                      {item.date}{item.total ? ` · ${item.total}` : ''}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}>
                    <StatusPill status={item.status} />
                    <button onClick={() => removeEntry(item.id)} style={{
                      background: 'none',
                      border: 'none',
                      color: Colors.red
                    }} aria-label="Supprimer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {(selected.profile.type === 'ecommerce' ? selected.orders : selected.collabs).length === 0 && (
                <div style={{
                  fontFamily: Fonts.body,
                  fontSize: 13,
                  color: Colors.ink,
                  textAlign: 'center',
                  padding: '16px 0'
                }}>
                  Aucune entrée.
                </div>
              )}
            </div>

            <h4 style={{
              fontFamily: Fonts.display,
              fontWeight: 700,
              fontSize: 13,
              color: Colors.navy,
              marginBottom: 8
            }}>
              Ajouter {selected.profile.type === 'ecommerce' ? 'une commande' : 'une collaboration'}
            </h4>
            <form onSubmit={addEntry} style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap'
            }}>
              <input placeholder="Libellé" value={newEntry.label} onChange={(e) => setNewEntry({ ...newEntry, label: e.target.value })} style={{
                ...inputStyle,
                flex: 2,
                minWidth: 140,
                width: 'auto'
              }} />
              <input placeholder="Date" value={newEntry.date} onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })} style={{
                ...inputStyle,
                flex: 1,
                minWidth: 100,
                width: 'auto'
              }} />
              {selected.profile.type === 'ecommerce' && (
                <input placeholder="Total" value={newEntry.total} onChange={(e) => setNewEntry({ ...newEntry, total: e.target.value })} style={{
                  ...inputStyle,
                  flex: 1,
                  minWidth: 90,
                  width: 'auto'
                }} />
              )}
              <select value={newEntry.status} onChange={(e) => setNewEntry({ ...newEntry, status: e.target.value })} style={{
                ...inputStyle,
                flex: 1,
                minWidth: 120,
                width: 'auto'
              }}>
                {selected.profile.type === 'ecommerce' ? (
                  <>
                    <option value="cours">En cours</option>
                    <option value="livre">Livré</option>
                    <option value="annule">Annulé</option>
                  </>
                ) : (
                  <>
                    <option value="attente">En attente</option>
                    <option value="acceptee">Acceptée</option>
                    <option value="refusee">Refusée</option>
                  </>
                )}
              </select>
              <button type="submit" className="btn-anim" style={{
                background: Colors.amber,
                color: Colors.navy,
                fontWeight: 700,
                fontSize: 13,
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none'
              }}>
                Ajouter
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AgencySpace;