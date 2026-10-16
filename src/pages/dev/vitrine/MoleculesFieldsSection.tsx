import { useState } from 'react';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { FormField } from '@/components/molecules/FormField';
import { MoneyField } from '@/components/molecules/MoneyField';
import { SearchField } from '@/components/molecules/SearchField';
import { VitrineGroup, VitrineSection } from './VitrineSection';

export function MoleculesFieldsSection() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [priceNum, setPriceNum] = useState<number | null>(null);
  const [query, setQuery] = useState('pantalona');

  const nameError = name.length > 0 && name.length < 3 ? 'Mínimo 3 caracteres' : undefined;
  const priceError = price.length > 0 && priceNum == null ? 'Digite um valor em reais' : undefined;

  return (
    <VitrineSection
      id="moleculas-campos"
      task="SHP-48"
      title="FormField, MoneyField e SearchField"
      note="Rótulo + ajuda/erro. Money com R$ e vírgula. Busca com ícone e limpar. Digite nome curto ou preço inválido para ver o erro."
    >
      <VitrineGroup label="Formulário (validação ao vivo)">
        <form
          className="grid max-w-lg gap-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <SearchField
            label="Buscar peça parecida"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            placeholder="Nome ou SKU"
          />
          <FormField label="Nome da peça" required hint="Como aparece na Shopee" error={nameError}>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Vestido midi" />
          </FormField>
          <MoneyField
            label="Preço de venda"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onValueChange={setPriceNum}
            error={priceError}
            hint={priceNum != null ? `Fica R$ ${priceNum.toFixed(2).replace('.', ',')}` : 'Ex.: 129,90'}
          />
          <FormField label="Tecido">
            <Select defaultValue="viscose">
              <option value="viscose">Viscose</option>
              <option value="algodao">Algodão</option>
              <option value="moletom">Moletom flanelado</option>
            </Select>
          </FormField>
          <FormField label="Descrição" hint="Tecido, caimento e medidas">
            <Textarea placeholder="Conte o tecido, o caimento e as medidas." rows={3} />
          </FormField>
        </form>
      </VitrineGroup>

      <VitrineGroup label="Estados do FormField">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Campo" hint="Texto de ajuda">
            <Input placeholder="Nome da peça" />
          </FormField>
          <FormField label="Com erro" error="Digite um valor em reais">
            <Input defaultValue="abc" />
          </FormField>
          <FormField label="Obrigatório" required hint="Precisa preencher">
            <Input />
          </FormField>
        </div>
      </VitrineGroup>

      <VitrineGroup label="Money e busca">
        <div className="grid gap-4 sm:grid-cols-2">
          <MoneyField label="Valor" defaultValue="129,90" />
          <SearchField placeholder="Buscar na barra (sem rótulo)" defaultValue="vestido" />
        </div>
      </VitrineGroup>
    </VitrineSection>
  );
}
