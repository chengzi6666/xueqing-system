# ����ѧԱ���������޸� - Product Requirement Document

## Overview
- **Summary**: �޸�����ѧԱͼƬ����ʧ�ܵ����⡣��ϵͳʶ�������ѧԱʱ��Ԥ��ҳ���ܹ�������ʾ�������ȫ�����ذ�ť������ѧԱ��ͼƬ�޷��ɹ����ء�
- **Purpose**: ȷ��ÿ��ѧԱ����������ѧԱ���ı��濨Ƭ���ܱ���ȷʶ�������
- **Target Users**: ��ʦ�û���������������ѧԱѧ�鱨��

## Goals
- ȷ������ѧԱ�ı��濨ƬIDȫ��Ψһ
- ȷ����������ʱ����ȷ��ȡ��������ѧԱ�Ŀ�Ƭ
- ����Ԥ��ҳ����ʾ����

## Non-Goals (Out of Scope)
- �޸���������߼�
- �޸�ѧԱ���ݽṹ
- �޸ĵ������������߼�

## Background & Context
- HTML�淶Ҫ��ID����Ψһ��`document.getElementById()`ֻ�᷵�ص�һ��ƥ���Ԫ��
- ��ǰϵͳʹ��`displayName`���ɿ�ƬID��`report-${displayName}-${lesson}`
- ����������ѧԱ��������ȫ��ͬʱ�����ǻ�����ͬ��`displayName`�����¿�ƬID�ظ�
- ���ǵ�����������ʧ�ܵĸ���ԭ��

## Functional Requirements
- **FR-1**: ÿ�����濨Ƭ������ȫ��Ψһ��ID
- **FR-2**: ��������ʱ����ȷ��ȡ���п�Ƭ����������ѧԱ�Ŀ�Ƭ��
- **FR-3**: ��ƬID�����߼�����ȷ��Ψһ�ԣ���ʹ`displayName`��ͬ

## Non-Functional Requirements
- **NFR-1**: �޸�����Ӱ�����й��ܣ�Ԥ�����������أ�
- **NFR-2**: �޸�Ӧ�ü���Ч������Ҫ���ģ�ع�

## Constraints
- **Technical**: JavaScriptԭ���������޿������
- **Dependencies**: html2canvas, JSZip

## Assumptions
- ÿ��ѧԱ��¼��`allParsedData`����Ψһ��λ��
- ���������Ի����Ѿ�Ϊÿ����¼������Ψһ��`_globalIndex`

## Acceptance Criteria

### AC-1: ����ѧԱ��ƬIDΨһ��
- **Given**: ��������������ȫ��ͬ������ѧԱ��������"����"����ȷ�ʡ������ʡ�ʱ������ͬ��
- **When**: ���ɱ��濨Ƭʱ
- **Then**: ������Ƭ��ID���벻ͬ
- **Verification**: `programmatic`

### AC-2: �������ذ�����������ѧԱ
- **Given**: ��������ѧԱ��Ԥ��ҳ��������ʾ����ѧԱ��Ƭ
- **When**: ���"һ���������б���"��ť
- **Then**: ���ص�ZIP�ļ��а�����������ѧԱ�ı���ͼƬ
- **Verification**: `human-judgment`

### AC-3: �������ع��ܲ���Ӱ��
- **Given**: ��������ѧԱ
- **When**: �������ѧԱ��Ƭ�����ذ�ť
- **Then**: ��ѧԱ�ı���ͼƬ����������
- **Verification**: `human-judgment`

## Open Questions
- [ ] ȷ��`_globalIndex`�������������Ƿ���ȷ���ݺͱ���
