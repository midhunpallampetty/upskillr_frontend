import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { 
  PaperClipIcon, 
  PaperAirplaneIcon, 
  TrashIcon, 
  ChatBubbleLeftIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserCircleIcon,
  PhotoIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import useStudentAuthGuard from '../../student/hooks/useStudentAuthGuard';

export type User = { _id: string; fullName: string; role: 'Student' | 'School' };
export type Asset = { _id: string; imageUrl: string };
export type Reply = {
  _id: string;
  forum_answer_id?: string;
  forum_question_id?: string;
  text: string;
  author: User;
  assets?: Asset[];
  parent_reply_id?: string;
  replies?: Reply[];
  createdAt: string;
};
export type Answer = {
  _id: string;
  forum_question_id: string;
  text: string;
  author: User;
  assets?: Asset[];
  replies?: Reply[];
  createdAt: string;
};
export type Question = {
  _id: string;
  question: string;
  author: User;
  assets?: Asset[];
  answers?: Answer[];
  replies?: Reply[];
  isDeleted: boolean;
  category: string;
  createdAt: string;
};

export type Toast = {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
};

export const API = import.meta.env.VITE_MAIN_API;
