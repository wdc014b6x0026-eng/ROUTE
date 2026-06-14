import { supabaseAdmin } from '../config/supabase.js';

export const getAllArtikel = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('artikel_edukasi')
      .select(`*, users (id, nama)`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getArtikelById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('artikel_edukasi')
      .select(`*, users (id, nama)`)
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getArtikelPublished = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('artikel_edukasi')
      .select(`*, users (id, nama)`)
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createArtikel = async (req, res) => {
  try {
    const { judul, konten, kategori, thumbnail_url, is_published } = req.body;
    const penulis_id = req.user.id;
    const published_at = is_published ? new Date().toISOString() : null;

    const { data, error } = await supabaseAdmin
      .from('artikel_edukasi')
      .insert([{ penulis_id, judul, konten, kategori, thumbnail_url, is_published: is_published || false, published_at }])
      .select();

    if (error) throw error;
    res.status(201).json({ status: 'success', data: data[0] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateArtikel = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, konten, kategori, thumbnail_url, is_published } = req.body;
    const published_at = is_published ? new Date().toISOString() : null;

    const { data, error } = await supabaseAdmin
      .from('artikel_edukasi')
      .update({ judul, konten, kategori, thumbnail_url, is_published, published_at })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json({ status: 'success', data: data[0] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteArtikel = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from('artikel_edukasi')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ status: 'success', message: 'Artikel berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
